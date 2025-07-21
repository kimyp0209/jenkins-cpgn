import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ProductListByCategory() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
  if (!category) return; // ✅ category 없으면 요청 안 보냄

  axios
    .get(`/api/products?category=${encodeURIComponent(category)}`)
    .then(res => setProducts(res.data))
    .catch(err => console.error("카테고리 상품 불러오기 실패", err));
}, [category]);

  return (
    <div className="container" style={{paddingTop:150, paddingBottom:50}}>
      <h5 style={{ fontSize:20, marginBottom:30, borderBottom:'1px solid #000', paddingBottom:10}}>{category}</h5>
      <div className="row">
        {products.map(p => (
          <div className="col-lg-4 col-md-6 col-sm-12" style={{marginBottom:70, padding:'0 20px'}} key={p.id}>
            <Link style={{textDecoration:'none'}} to={`/products/${p.id}`}>
              <div className="h-100">
                <img src={p.thumbnailimg} className="card-img-top" alt="썸네일" />
                <div className="card-body" style={{marginTop:10}}>
                  <h5 style={{fontSize:13, marginBottom:5, color:'#000'}} className="card-title">{p.name}</h5>
                  {p.percent > 0 && (
                  <p style={{fontSize:12, color:'#555', margin:0}} className="card-text"><del>{p.price.toLocaleString()}원</del></p>
                  )}
                  <div style={{display:'flex'}}>
                    {p.percent > 0 && (
                  <p style={{fontSize:13, margin:0, color:'red', marginRight:5}}>{p.percent}%</p>
                  )}
                  <p style={{fontSize:13, fontWeight:700, color:'#000'}} className="card-text">
                    {(p.price * (1 - p.percent / 100)).toLocaleString()}원
                  </p>
                  </div>
                </div>
                
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListByCategory;
