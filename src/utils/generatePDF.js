import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";

export async function generatePDF() {
  const doc = new jsPDF();
  const asistencias = await getDocs(collection(db, "asistencias"));

  doc.text("Reporte de Asistencia", 10, 10);
  doc.text("Fecha: " + new Date().toLocaleDateString(), 10, 20);

  let y = 40; // Posición inicial en Y
  asistencias.forEach((asistencia, index) => {
    const data = asistencia.data();
    doc.text(`${index + 1}. ${data.usuario.displayName || "Usuario Desconocido"} - ${data.fecha.toDate().toLocaleString()}`, 10, y);
    y += 10;
  });

  doc.save("asistencia.pdf");
}
