const fs = require('fs')

const messages = new Map(Object.entries({
    125: [
        [245,342,523],
        [242,293,274]
    ]
}));

const promises = Array.from(messages).map(([canId, byteArrs]) =>
    new Promise((resolve, reject) => {
        const csv = byteArrs.map(byteArr => byteArr.join(',')).join('\n')
        console.log(csv);
        fs.writeFile(`/Users/brad/can/${canId}.csv`, csv, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }

            resolve()
        })
    })
)

Promise
    .all(promises)
    .then(process.exit)