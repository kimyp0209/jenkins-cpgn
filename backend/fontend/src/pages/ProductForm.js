import { useState, useEffect } from "react";
import { createProduct, updateProduct, fetchProductDetail, uploadImage } from "../api";
import { useNavigate, useParams } from "react-router-dom";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    thumbnailimg: "",
    detailimg: "",
    percent: 0,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [detailFile, setDetailFile] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductDetail(id).then(res => setProduct(res.data));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === "price" || name === "percent" ? Number(value) : value,
    }));
  };

  const handleSubmit = async e => {
  e.preventDefault();

  const { createdAt, ...productWithoutCreatedAt } = product;

  const formData = new FormData();

  formData.append(
  "product",
  new Blob([JSON.stringify(productWithoutCreatedAt)], { type: "application/json" }),
  "product.json"
);

  if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);
  if (detailFile) formData.append("detailFile", detailFile);

  try {
    if (id) {
      await updateProduct(id, formData);
      alert("수정 완료");
    } else {
      await createProduct(formData);
      alert("등록 완료");
    }
    navigate("/admin/products");
    //navigate(`/products/category/${encodeURIComponent(product.category)}`);
  } catch (err) {
    console.error("에러:", err);
    alert("오류 발생");
  }
};



  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom:100 }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 50 }}>
        {id ? "상품 수정" : "상품 등록"}
      </h2>
      <form onSubmit={handleSubmit}>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th style={{ width: "20%" }}>카테고리</th>
              <td>
                <select
                  className="form-select"
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  required
                  style={{borderRadius:0}}
                >
                  <option value="">카테고리 선택</option>
                  <option value="1/2 TEE">1/2 TEE</option>
                  <option value="HOOD">HOOD</option>
                  <option value="SWEAT SHIRT">SWEAT SHIRT</option>
                  <option value="LONG SLEEVES">LONG SLEEVES</option>
                  <option value="OUTER">OUTER</option>
                  <option value="BOTTOM">BOTTOM</option>
                  <option value="KNIT">KNIT</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>상품명</th>
              <td>
                <input
                  className="form-control"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
            <tr>
              <th>가격</th>
              <td>
                <input
                  className="form-control"
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleChange}
                  required
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
            <tr>
              <th>할인율 (%)</th>
              <td>
                <input
                  className="form-control"
                  name="percent"
                  type="number"
                  value={product.percent}
                  onChange={handleChange}
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
            <tr>
              <th>썸네일 이미지</th>
              <td>
                <input
                  className="form-control"
                  type="file"
                  onChange={e => setThumbnailFile(e.target.files[0])}
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
            <tr>
              <th>상세 이미지</th>
              <td>
                <input
                  className="form-control"
                  type="file"
                  onChange={e => setDetailFile(e.target.files[0])}
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
            <tr>
              <th>상품 설명</th>
              <td>
                <textarea
                  className="form-control"
                  name="description"
                  rows="6"
                  value={product.description}
                  onChange={handleChange}
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-center mt-4">
          <button style={{ width: 200, borderRadius: 0 }} className="btn btn-dark" type="submit">
            {id ? "수정" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
