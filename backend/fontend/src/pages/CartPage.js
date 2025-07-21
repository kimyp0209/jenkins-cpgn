import { useEffect, useState } from "react";
import { fetchCart, updateCartQuantity, deleteCartItem, clearCart  } from "../api";
import { useNavigate, Link } from "react-router-dom";
import './style.css';

function CartPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const navigate = useNavigate();
  const [allSelected, setAllSelected] = useState(false);

  

  const loadCart = async () => {
    const res = await fetchCart();
    setItems(res.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  // 전체 선택 토글
  const handleSelectAll = () => {
    const newAllSelected = !allSelected;
    setAllSelected(newAllSelected);

    const newSelected = {};
    if (newAllSelected) {
      items.forEach((item) => {
        newSelected[item.productId] = true;
      });
    }
    setSelected(newSelected);
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    await updateCartQuantity(productId, quantity);
    loadCart();
  };

  const handleDelete = async (productId) => {
    await deleteCartItem(productId);
    loadCart();
  };

  const handleCheckout = () => {
  const selectedItems = items.filter((item) => selected[item.productId]);

  console.log("👉 선택된 상품:", selectedItems);

  if (!selectedItems || selectedItems.length === 0) {
    alert("결제할 상품을 선택해 주세요.");
    return;
  }

  const totalAmount  = selectedItems.reduce((sum, item) => {
    const discounted = item.price * (1 - item.percent / 100);
    return sum + discounted * item.quantity;
  }, 0);

  navigate("/shipping", {
  state: {
    items: selectedItems, // 선택된 상품들
    amount: totalAmount   // 총액
  }
});
};

  const totalPrice = items.reduce((sum, item) => {
    const discounted = item.price * (1 - item.percent / 100);
    return sum + discounted * item.quantity;
  }, 0);

  const handleSelect = (productId) => {
    const newSelected = {
      ...selected,
      [productId]: !selected[productId],
    };
    setSelected(newSelected);

    const isAllChecked = items.every((item) => newSelected[item.productId]);
    setAllSelected(isAllChecked);
  };

  const selectedTotal = items.reduce((sum, item) => {
    if (selected[item.productId]) {
      const discounted = item.price * (1 - item.percent / 100);
      return sum + discounted * item.quantity;
    }
    return sum;
  }, 0);

  useEffect(() => {
    const isAllChecked =
      items.length > 0 && items.every((item) => selected[item.productId]);
    setAllSelected(isAllChecked);
  }, [items, selected]);

  const handleClearCart = async () => {
  try {
    await clearCart();
    alert("장바구니를 비웠습니다.");
    // 장바구니 다시 불러오기
    loadCart(); // 이미 있는 함수일 경우
  } catch (err) {
    console.error("장바구니 비우기 실패", err);
    alert("장바구니 비우기 중 오류 발생");
  }
};

  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom:150 }}>
      <p
        style={{
          paddingBottom: 5,
          borderBottom: "1px solid #eee",
          marginBottom: 30,
        }}
      >
        CART
      </p>
      <div className="order-steps" style={{
        width: "100%",
        backgroundColor: "#f8f8f8",
        height: "auto",
        fontSize: 18,
        marginBottom: 50,
        padding: "20px 0"
      }}>
        <div className="steps-wrapper" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 95,
          flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img style={{ width: 21, height: 23, marginRight: 20 }} src="/img/order-icon01.png" alt="" />
            <p style={{ margin: 0 }}>01. 장바구니</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img style={{ width: 19, height: 23, marginRight: 20 }} src="/img/order-icon02-1.png" alt="" />
            <p style={{ margin: 0, color: "#8d8d8d" }}>02. 주문서 작성</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img style={{ width: 23, height: 23, marginRight: 20 }} src="/img/order-icon03-1.png" alt="" />
            <p style={{ margin: 0, color: "#8d8d8d" }}>03. 주문완료</p>
          </div>
        </div>
      </div>
      {items.length === 0 ? (
        <p style={{textAlign:'center'}}>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <table className="table table-bordered text-center" style={{borderTop:'2px solid #000', verticalAlign:'middle'}}>
            <thead className="table" style={{borderBottom:'1px solid #e8e8e8'}}>
              <tr style={{border:0}}>
                <th style={{padding:'15px 0'}}>
                  {" "}
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th></th>
                <th style={{padding:'15px 0'}}>제품명</th>
                <th style={{padding:'15px 0'}}>판매가</th>
                <th style={{padding:'15px 0'}}>수량</th>
                <th style={{padding:'15px 0'}}>합계</th>
                <th style={{padding:'15px 0'}}>배송비</th>
                <th style={{padding:'15px 0'}}>처리</th>
              </tr>
            </thead>
            <tbody style={{borderBottom:'1px solid #e8e8e8 '}}>
              {items.map((item) => {
                const discounted = item.price * (1 - item.percent / 100);
                return (
                  <tr key={item.productId} style={{borderBottom:'1px solid #e8e8e8'}}>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!selected[item.productId]}
                        onChange={() => handleSelect(item.productId)}
                      />
                    </td>
                    <td>
                      <img style={{padding:'15px 0'}} src={item.thumbnailimg} alt="" width="60" />
                    </td>
                    <td style={{textAlign:'left'}}>{item.productName}</td>
                    <td>
                      <div>{item.price.toLocaleString()}원</div>
                      <div className="text-danger small">-{item.percent}%</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <button
    onClick={() =>
      handleQuantityChange(item.productId, Math.max(1, item.quantity - 1))
    }
    className="btn btn-outline-secondary"
    style={{ borderRadius: 0, width: 30, height: 30, padding: 0 }}
  >
    −
  </button>
  <input
    type="number"
    min="1"
    value={item.quantity}
    onChange={(e) =>
      handleQuantityChange(item.productId, Math.max(1, Number(e.target.value)))
    }
    className="form-control text-center"
    style={{
      width: 50,
      height: 30,
      borderRadius: 0,
      border: '1px solid #6c757d',
      borderLeft: 0,
      borderRight: 0,
    }}
  />
  <button
    onClick={() =>
      handleQuantityChange(item.productId, item.quantity + 1)
    }
    className="btn btn-outline-secondary"
    style={{ borderRadius: 0, width: 30, height: 30, padding: 0 }}
  >
    ＋
  </button>
</div>

                    </td>
                    <td className="fw-bold text">
                      {Math.floor(discounted * item.quantity).toLocaleString()}
                      원
                    </td>
                    <td>무료</td>
                    <td>
                      <button
                        style={{border:'1px solid #e8e8e8', borderRadius:0, fontSize:13, padding:'4px 6px', width:73, height:30}}
                        className="btn"
                        onClick={() => handleDelete(item.productId)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h5 className="text-end mt-4 mb-4">
            총 금액:{" "}
            <strong>{Math.floor(selectedTotal).toLocaleString()}원</strong>
          </h5>

          <div style={{display:'flex', float:"right", height:45, gap:10, fontSize:14}}>
            <Link style={{display:'block', borderRadius:0, width:150, textAlign:'center', padding:'6px 6px', lineHeight: 2, border:'1px solid #e8e8e8', color:'#555', textDecoration:'none' }} to="/">계속 쇼핑하기</Link>
            <button style={{borderRadius:0, width:150, margin:0, fontSize:14, border:'1px solid #e8e8e8', color:'#555'}} className="btn" onClick={handleClearCart}>
              장바구니 비우기
            </button>
            <button style={{borderRadius:0, width:150, margin:0, fontSize:14, border:'none'}} className="btn btn-dark" onClick={handleCheckout}>
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
