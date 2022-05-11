# Rank Watcher

## API Doc

| resource                         | description                                                          |
|:---------------------------------|:---------------------------------------------------------------------|
| `/`                              | returns Hello world                                                  |
| `/watcher/all`                   | fetches all registered user's stats and notifies to bot              |
| `/watcher/:user`                 | fetches designated user's stats and notifies to bot (user: `string`) |
| `/register/:user/:platform`      | register user to db                                                  |
| `/delete/:user`                  | delete user from db                                                  |
| `/update/uid/:old/:new`          | updates userID (old: `string`, new: `string`)                        |
| `/update/data/level/:user/:data` | updates level (user: `string`, data: `int`)                          |
| `/update/data/trio/:user/:data`  | updates trio rank (user: `string`, data: `int`)                      |
| `/update/data/arena/:user/:data` | updates arena rank (user: `string`, data: `int`)                     |

## Cronjob
Edit crontab with
```bash
$ crontab -u <username> -e
```
Add the following line to crontab:
```
00 */1 * * * /path/to/watcher/cronjob.sh
```
