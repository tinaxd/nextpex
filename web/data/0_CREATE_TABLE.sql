CREATE TABLE `user_data` (
                             `uid` varchar(255) NOT NULL,
                             `platform` varchar(255) NOT NULL,
                             `level` int(11) NOT NULL DEFAULT 0,
                             `trio_rank` int(11) NOT NULL DEFAULT 0,
                             `arena_rank` int(11) NOT NULL DEFAULT 0,
                             `last_update` int(26) NOT NULL DEFAULT 0,
                             PRIMARY KEY (`uid`)
);