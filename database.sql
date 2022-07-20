CREATE TABLE IF NOT EXIST gt_api (
    api_id        int          null,
    username      varchar(64)  null,
    password      varchar(120) null,
    status        tinyint      null,
    date_added    datetime     null,
    date_modified datetime     null
);

INSERT INTO gt_api (api_id, username, password, status, date_added, date_modified) VALUES (0, 'apiPublic1', '$2b$10$T9VR6rt1RF5R7N1uIvl3eOD3ZXpetXGTgbmnL7fcnnZ10NydDLSvC', 1, '2022-03-08 03:10:21', '2022-03-08 03:10:23');
