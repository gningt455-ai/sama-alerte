import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import AlertsAdmin from "./AlertsAdmin"

function App() {
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)
  const [video, setVideo] = useState(null)
  const [message, setMessage] = useState("")
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let imageUrl = null
    let videoUrl = null

    if (file) {
      const { data, error } = await supabase.storage
        .from("alerts-images")
        .upload(`alert-${Date.now()}.jpg`, file)

      if (error) {
        setMessage("❌ Erreur upload image : " + error.message)
        return
      }
      imageUrl = supabase.storage.from("alerts-images").getPublicUrl(data.path).data.publicUrl
    }

    if (video) {
      const { data, error } = await supabase.storage
        .from("alerts-videos")
        .upload(`alert-${Date.now()}.mp4`, video)

      if (error) {
        setMessage("❌ Erreur upload vidéo : " + error.message)
        return
      }
      videoUrl = supabase.storage.from("alerts-videos").getPublicUrl(data.path).data.publicUrl
    }

    const { error } = await supabase
      .from("alerts")
      .insert([
        {
          user_id: (await supabase.auth.getUser()).data.user.id,
          category,
          description,
          image: imageUrl,
          video: videoUrl,
          status: "pending",
        },
      ])

    if (error) {
      setMessage("❌ Erreur insertion : " + error.message)
    } else {
      setMessage("✅ Alerte ajoutée avec succès !")
      setCategory("")
      setDescription("")
      setFile(null)
      setVideo(null)
      fetchAlerts()
    }
  }

  const fetchAlerts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.error("❌ Erreur récupération :", error.message)
    } else {
      setAlerts(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">SignalÉco – Ajouter une alerte</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Envoyer
        </button>
      </form>

      <p className="mt-4">{message}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">📋 Mes alertes</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : alerts.length === 0 ? (
        <p>Aucune alerte pour l’instant.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li key={alert.id} className="border rounded p-4 shadow-sm">
              <strong>{alert.category}</strong> – {alert.description}  
              <em className="block mt-2">Status : {alert.status}</em>
              {alert.image && <img src={alert.image} alt="Alerte" className="mt-2 w-48 rounded" />}
              {alert.video && (
                <video width="300" controls className="mt-2 rounded shadow">
                  <source src={alert.video} type="video/mp4" />
                </video>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Section admin */}
      <AlertsAdmin />
    </div>
  )
}

export default App
