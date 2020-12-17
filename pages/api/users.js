// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const users=[
  {name:'Jhon Martinez', age:33, id:'123456'},
  {name:'Oscar Tirado', age:34, id:'123455'},
  {name:'Julian Navarro', age:23, id:'111111'},
  {name:'Esteban Estrada', age:18, id:'1234522226'}
]


export default (req, res) => {
  res.statusCode = 200
  res.json(users)
}
