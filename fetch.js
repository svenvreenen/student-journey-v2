import fs from 'fs';
const response = await fetch('https://student-journey-back-bxovn.ondigitalocean.app/schema/snapshot', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer IK0nv0q1imI0Zlq2W4G9Td-lPwi_nzAd',
    'Content-Type': 'application/json'
  },

    }
  )


const schema = await response.json()
fs.writeFileSync('schemaupdated.txt', JSON.stringify(schema, null, 2))
console.log(JSON.stringify(schema, null, 2))
