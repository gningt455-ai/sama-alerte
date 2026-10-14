import { useState, useEffect } from "react"
import { supabase } from "./supabase"

function AlertsAdmin() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("id", { ascending: false })

      if (error) {
        console.error("❌ Erreur récupération :", error.message)
      } else {
        setAlerts(data)
      }
    }

    fetchAlerts()
  }, [])

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("alerts")
      .update({ status: newStatus })
      .eq("id", id)

    if (error) {
      console.error("❌ Erreur update :", error.message)
    } else {
      setAlerts(alerts.map(a => a.id === id ? { ...a, status: newStatus } : a))
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-red-500 text-white px-2 py-1 rounded">Pending</span>
      case "in_progress":
        return <span className="bg-orange-500 text-white px-2 py-1 rounded">In Progress</span>
      case "resolved":
        return <span className="bg-green-500 text-white px-2 py-1 rounded">Resolved</span>
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded">Unknown</span>
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">📊 Tableau de bord – Gestion des alertes</h2>
      <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Catégorie</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Statut</th>
            <th className="px-4 py-2 border">Actions</th>
            <th className="px-4 py-2 border">Vidéo</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{alert.category}</td>
              <td className="px-4 py-2 border">{alert.description}</td>
              <td className="px-4 py-2 border">{getStatusBadge(alert.status)}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                  onClick={() => updateStatus(alert.id, "in_progress")}
                >
                  Mettre en cours
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => updateStatus(alert.id, "resolved")}
                >
                  Résoudre
                </button>
              </td>
              <td className="px-4 py-2 border">
                {alert.video && (
                  <video width="200" controls className="rounded shadow">
                    <source src={alert.video} type="video/mp4" />
                  </video>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AlertsAdmin
