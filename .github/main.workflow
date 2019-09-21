workflow "Scan for any secrets on PR" {
  on = "pull_request"
  resolves = ["BetrayMe"]
}

action "BetrayMe" {
  uses = "docker://yashints/betrayme"
}