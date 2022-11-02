db.createUser(
  {
    user: "memo_nft",
    pwd: "memo_pswd",
    roles: [
      {
        role: "readWrite",
        db: "poap-db"
      }
    ]
  }
);
db.createCollection("test");