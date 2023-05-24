
export default async function chat(req, res) {
  console.log(req.body)
  const data = await fetch('http://0.0.0.0:8080/chat',
    {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({message:req.body.message}),
      redirect:'follow'
    }).then(data => data.json())
  res.status(200).json(data)

}
