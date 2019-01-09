const fs = require('fs')

const dir = '/Users/brad/can'

fs.readdir(dir, (err, files) => {
    if (err) {
        return console.error(err)
    }

    files
        .filter(file => /\.csv$/.test(file))
        .forEach(file => {
            fs.readFile(`${dir}/${file}`, (err, data) => {
                if (err) {
                    return console.error(err)
                }

                console.log(`${file}\n`)

                const values = data
                    .toString()
                    .split('\n')
                    .map(csv => csv.substr(0, csv.length - 2))
                
                const occs = values.reduce((acc, curr) => {
                    acc[curr] ? acc[curr]++ : acc[curr] = 1
                    return acc
                }, {})

                console.log(occs)
            })
        })
})