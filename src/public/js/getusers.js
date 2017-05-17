var getUsersByCity = function(name, email, occuaption, cb) {
       db.users.find({'name': name, 'email': email, 'occupation': occupation}).toArray(cb);
   }
