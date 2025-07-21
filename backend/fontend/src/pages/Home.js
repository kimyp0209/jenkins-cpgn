import MainSlider from '../components/MainSlider';
import { useEffect, useState } from "react";
import axios from 'axios';
import { fetchLatestProducts } from "../api";
import { Link } from "react-router-dom";
import './style.css';

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetchLatestProducts()
      .then(res => setLatestProducts(res.data))
      .catch(err => console.error("최신 상품 불러오기 실패:", err));
  }, []);

  useEffect(() => {
    axios.get("/api/products/popular")
      .then(res => setPopularProducts(res.data))
      .catch(err => console.error("인기 상품 불러오기 실패", err));
  }, []);

  return (
    <div>
      <MainSlider />
      <div className="container none" style={{ marginTop: 100, marginBottom: 70 }}>
        <h4 style={{ fontWeight: "bold", marginBottom: 30 }}>✨ NEW</h4>
        <div className="row g-4">
          {latestProducts.map(p => (
            <div key={p.id} className="col-lg-3 col-sm-6 col-12">
              <div className="card h-100 border-0" style={{borderRadius:0}}>
                <Link to={`/products/${p.id}`} style={{ textDecoration: "none", color: "inherit", borderRadius:0 }}>
                  <img
                    src={p.thumbnailimg}
                    alt={p.name}
                    className="card-img-top"
                    style={{ aspectRatio: "4 / 5", objectFit: "cover", width: "100%", borderRadius:0 }}/>
                  <div className="card-body" style={{ padding: 16, paddingLeft:0 }}>
                    <h5 className="card-title" style={{ fontWeight: "bold", fontSize: 16 }}>{p.name}</h5>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                       {p.percent > 0 && (
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'red', marginRight: 5 }}>{p.percent}%</span>
                       )}
                      <span style={{ fontSize: 14, fontWeight: 700 }}>
                        {(p.price * (1 - p.percent / 100)).toLocaleString()}원
                      </span>
                      {p.percent > 0 && (
                      <span style={{ fontSize: 12, marginLeft: 6, color: "#999" }}>
                        <del>{p.price.toLocaleString()}원</del>
                      </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="text-end px-3 pb-3">
                  <Link
                    to={`/products/category/${encodeURIComponent(p.category)}`}
                    style={{ fontSize: 13, color: "#555", textDecoration: "underline" }}
                  >
                    {p.category} 바로가기
                    <img
                      src="/img/icon_board_arrow_left.svg"
                      alt="→"
                      style={{ width: 13, marginLeft: 4 }}
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h4 className="fw-bold mb-4" style={{marginTop:100}}>🔥 BEST</h4>
      <div className="row">
        {popularProducts.map(p => (
          <div key={p.id} className="col-lg-3 col-sm-6 col-12 mb-4">
            <div className="card h-100 border-0" style={{borderRadius:0}}>
              <Link to={`/products/${p.id}`} style={{ borderRadius:0, textDecoration: "none", color: "inherit" }}>
                <img src={p.thumbnailimg} alt={p.name} className="card-img-top"
                  style={{ aspectRatio: "4/5", objectFit: "cover", borderRadius:0 }} />
                <div className="card-body" style={{ padding: 16, paddingLeft: 0 }}>
                  <h5 className="card-title" style={{ fontWeight: "bold", fontSize: 16 }}>{p.name}</h5>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {p.percent > 0 && (
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'red', marginRight: 5 }}>{p.percent}%</span>
                    )}
                    <span style={{ fontSize: 14, fontWeight: 700 }}>
                      {(p.price * (1 - p.percent / 100)).toLocaleString()}원
                    </span>
                    {p.percent > 0 && (
                    <span style={{ fontSize: 12, marginLeft: 6, color: "#999" }}>
                      <del>{p.price.toLocaleString()}원</del>
                    </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
