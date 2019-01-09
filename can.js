const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const fs = require('fs')

const port = new SerialPort('/dev/cu.wchusbserial1410', {
    baudRate: 9600
})

const parser = port.pipe(new Readline({ delimiter: '\n' }))

let messages = new Map();
parser.on('data', line => {
    if (line.indexOf(',') === -1) return;

    const [canId, ...bytes] = line.split(',')
    if (!messages.has(canId)) {
        messages.set(canId, [])
        console.log(`${canId}: ${bytes}`)
    }

    const canMsgs = messages.get(canId)

    if (!canMsgs.includes(bytes)) {
        canMsgs.push(bytes)
    }
})

process.on('SIGINT', () => {
    console.log('ending')
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
})