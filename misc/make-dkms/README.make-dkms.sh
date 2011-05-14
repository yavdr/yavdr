
Short description
-----------------

Requirements: linux-headers-.... , 
              mercurial, git (for update the repos and getting the hg version), 
              gcc etc,
              dput,
              gnupg-agent,
              patched dkms

Directory structure:
make-dkms.sh
   repositories/
   patches/
   templates/

below this directories: the repo name (s2-liplianin or v4l-dvb)
in this directories: 
   repositories: the checkout of the repo's
   patches: patches you want to apply in the dkms package
   templates: dkms mkdeb/mkdsc template (mkdsc and mkdeb is the same)

call make-dkms.sh <name of the repo> will make test build, extract 
the module names, and build the dkmsconf for it. Then the dkms package will be created
and uploaded to launchpad.

call make-dkms.sh clean to clean up after successfull build or when you like

Good Luck ! ;) 
