import Image from "next/image";

export default async function Home() {
const res = await fetch('http://localhost:8000/api/test-koneksi', {
  cache: 'no-store'
});

const data = await res.json();


  return (
     <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Proyek Fullstack Pertama Kami 🧑‍💻</h1>
      <p style={{ fontSize: '20px', color: 'green', fontWeight: 'bold' }}>
        {data.pesan}
      </p>
      <p>Status API: {data.status}</p>
    </div>
  );
}
