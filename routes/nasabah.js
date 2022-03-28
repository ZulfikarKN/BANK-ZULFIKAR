var express = require('express');
var router = express.Router();
var fs = require('fs');

var data = JSON.parse(fs.readFileSync(__dirname + '/nasabah.json'));

/* GET all nasabah list */
router.get('/', function(req, res) {
  var keis = req.body;
  var keys = data.nasabah[0];
  var nasabah = [];

  for (var kei in keis) {
    for (var key in keys) {
      if (kei == key) {
        matched = data.nasabah.find(x => x[`${kei}`] == req.body[`${kei}`]);
        matched ? nasabah.push(matched) : res.send({message: `${kei}: ${req.body[`${kei}`]} not found!`});
      }
    }
  }
  nasabah.length != 0 ? res.send(nasabah) : res.send(data.nasabah);
  console.log({message: "nasabah get func triggered"});
  res.end();
});

/* POST nasabah */
router.post('/', (req, res)=> {
  const id = req.body.id;
  const { nama } = req.body;
  const { alamat } = req.body;
  const { tempatLahir } = req.body;
  const { tanggalLahir } = req.body;
  const { noKTP } = req.body;
  const { noHP } = req.body;

  var nasabah = [];
  data.nasabah.find((ele)=> {
    if (ele.id == id || ele.noKTP == noKTP) {
      nasabah.push(ele);
    }
  });

  if (nasabah.length > 0) {
    res.status(208).send({message: "noKTP or id is already registered!"})
  } else {
    data["nasabah"].push({
      "id": id? parseInt(id) : data["nasabah"][data["nasabah"].length-1].id + 1,
      "nama": nama ? nama : '-',
      "alamat": alamat ? alamat : '-',
      "tempatLahir" : tempatLahir? tempatLahir : '-',
      "tanggalLahir": tanggalLahir? tanggalLahir : '-',
      "noKTP": noKTP ? noKTP : '-',
      "noHP": noHP ? noHP : '-'
    });
    fileWrite(JSON.stringify(data));
    res.send({message: "nasabah added sucessfully!"});
  }
  console.log({message: "nasabah post func triggered"});
  res.end();
});

/* DELETE nasabah */
router.delete('/', function(req, res) {
  var id = req.body.id;
  var nasabah = data.nasabah.find(x => x.id == id);
  
  if (nasabah) {
    var newnasabah = data.nasabah.filter(x => x != nasabah);
    data.nasabah = newnasabah;
    fileWrite(JSON.stringify(data));
    console.log({message: "nasabah delete func triggered"});
    res.send({message: `nasabah ${id} has been deleted`});
  } else {
    res.status(201).send({message: 'need an id'});
  }
  console.log({message: "nasabah delete func triggered"});
  res.end();
});

/* Update Nasabah */
router.patch('/', (req, res)=> {
  const id = req.body.id
  const keis = req.body;
  
  if (!id) {
    res.status(201).send({message: 'need an id'});
  } else {
    const nasabah = data.nasabah.find(x => x.id == id);
    if (!nasabah) {
      res.status(404).send({
          message: "id not found"
      });
    } else {
        for (var key in keis) {
            for (var i in nasabah) {
                if (key == i) {
                    nasabah[`${key}`] = req.body[`${key}`] 
                }
            }
        }
        data["nasabah"].find((ele) => {
            if (ele.id == nasabah.id) {
                return nasabah
            }
        });
      fileWrite(JSON.stringify(data));
      res.send({message: 'nasabah updated'})
    }
  }
  console.log({message: "nasabah patch func triggered"});
  res.end();
});

function fileWrite(data) {
  return fs.writeFileSync(__dirname + "/nasabah.json", data, function(err) {
      if (err) throw err;
  });
}

module.exports = router;
