CREATE TABLE `ScamReports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`waddress` text,
	`dateAdded` text,
	`scamType` text,
	`scamAddress` text,
	`country` text,
	`description` text,
	`source` text,
	`siteUrl` text
);
