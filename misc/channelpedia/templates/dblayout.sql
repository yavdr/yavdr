CREATE TABLE channels(
    name TEXT,
    provider TEXT,
    frequency INTEGER,
    modulation TEXT,
    source TEXT,
    symbolrate INTEGER,
    vpid INTEGER,
    apid INTEGER,
    tpid TEXT,
    caid TEXT,
    sid INTEGER,
    nid INTEGER,
    tid TEXT,
    rid INTEGER,
    label TEXT,
    last_changed TIMESTAMP,
    PRIMARY KEY ( source, nid, tid, sid)
);

CREATE TABLE channel_update_log(
    timestamp TIMESTAMP,
    name TEXT,
    combined_id TEXT,
    update_description TEXT
);
