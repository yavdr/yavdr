#!/bin/bash -e

# call with repo name and make sure all files exist
# 
# - patches
# - template
# - repo
#

###########
# make sure linux-headers is installed 
# and adapt to the kernel you like to compile for
########################

KERNEL=2.6.32-28-generic
if [ -z "$KERNEL" ]; then
    if [ ! -z "$2" ]; then
    	KERNEL="$2"
    else
        KERNEL="`uname -r`"
    fi
fi

case $1 in 
   s2-liplianin|v4l-dvb) 
           REPO=$1
	   ;;
   clean)
           rm -rf tmp.* &> /dev/null || /bin/true 
           rm -rf temp-build &> /dev/null || /bin/true 
           rm dkms.conf.* &> /dev/null || /bin/true

           exit 0
           ;;
   *)
           exit 1
           ;;
esac
if [ "$REPO" = "s2-liplianin" ]; then 
    VERSION=0~`/bin/date --utc +%0Y%0m%0d`.`hg identify -n repositories/$REPO | cut -d'+' -f1`
else 
    VERSION=0~`/bin/date --utc +%0Y%0m%0d`.git`cat repositories/$REPO/.git/refs/heads/master`
fi



PATCHES=( `find patches/$REPO/* -name *.patch | tac` )

# generate dkms.conf
cat <<EOF > dkms.conf.$REPO
PACKAGE_NAME=$REPO
PACKAGE_VERSION=$VERSION
AUTOINSTALL=y
MAKE[0]="make -j5 VER=\$kernelver"
EOF

PATCHCOUNT=0
for PATCH in ${PATCHES[@]} ; do 
echo "PATCH[$PATCHCOUNT]=`basename $PATCH`" >> dkms.conf.$REPO
if [ -f "${PATCH}.match" ]; then
    echo "PATCH_MATCH[$PATCHCOUNT]=\"`cat ${PATCH}.match`\"" >> dkms.conf.$REPO
fi
PATCHCOUNT=$(( $PATCHCOUNT + 1 ))
done 

# temporary build
if [ ! -d temp-build ]; then
    cp -r repositories/$REPO temp-build
    for PATCH in ${PATCHES[@]} ; do
        if [ ! -f "${PATCH}.match" ] || echo "$KERNEL" | egrep -q "`cat ${PATCH}.match`"; then
            echo "Patching $PATCH ... "
            patch -d temp-build -p1 < $PATCH
        fi
    done
    make -j5 -C temp-build KERNELRELEASE=$KERNEL VER=$KERNEL
fi

cd temp-build

# determine module names and paths from temporary build
i=0
for f in `find -name *.ko`; do 
    M=`basename $f .ko`
    echo "BUILT_MODULE_NAME[$i]=$M" >> ../dkms.conf.$REPO
    echo "BUILT_MODULE_LOCATION[$i]=`dirname $f`" >> ../dkms.conf.$REPO
    echo "DEST_MODULE_LOCATION[$i]=/updates/dkms" >> ../dkms.conf.$REPO
    ((i=i+1))
done
cd ..

# create temporary source and dkms trees
srctree=`mktemp -d --tmpdir=$PWD`
dkmstree=`mktemp -d --tmpdir=$PWD`
cp /var/lib/dkms/dkms_dbversion $dkmstree
trap "rm -rf $srctree $dkmstree" 0 1 2 3 4 5 6 7 8 10 11 12 13 14 15

# copy to srctree (without .hg/)
D="$srctree/${REPO}-$VERSION"
mkdir -p $D
cp -r repositories/${REPO}/* $D

# modules are not versioned properly, so kill the versions to disable dkms'
# version comparison
find $D -name '*.c' | xargs sed -i '/^MODULE_VERSION\>/d'

cp dkms.conf.$REPO $D/dkms.conf
mkdir $D/patches
cp patches/$REPO/*.patch $D/patches

cp -r templates/$REPO $D/${REPO}-dkms-mkdsc
cp -r templates/$REPO $D/${REPO}-dkms-mkdeb

# register to dkms
dkms --sourcetree $srctree --dkmstree $dkmstree add -m ${REPO} -v $VERSION -k $KERNEL
dkms --sourcetree $srctree --dkmstree $dkmstree build -m ${REPO} -v $VERSION -k $KERNEL
# build debian source package
dkms --sourcetree $srctree --dkmstree $dkmstree mkdsc -m ${REPO} -v $VERSION -k $KERNEL
cp $dkmstree/${REPO}/$VERSION/dsc/* ./packages/dsc/

# mkdeb
#dkms --sourcetree $srctree --dkmstree $dkmstree mkdeb -m ${REPO} -v $VERSION -k $KERNEL
#cp $dkmstree/${REPO}/$VERSION/deb/* ./packages/deb/

# upload to ppa
dput ppa:yavdr/testing-vdr ./packages/dsc/$REPO-*.changes
