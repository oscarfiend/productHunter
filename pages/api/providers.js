// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const providers=[
  {name:'Provider 1', age:33, id:'123456'},
  {name:'Provider 2', age:34, id:'123455'},
  {name:'Provider 3', age:23, id:'111111'},
  {name:'Provider 4', age:18, id:'1234522226'}
]

export default (req, res) => {
  res.statusCode = 200
  res.json(providers)
}

