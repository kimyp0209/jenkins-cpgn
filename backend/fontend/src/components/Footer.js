import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <div style={{ backgroundColor: '#1c1b1b' }}>
            <div className="footer_in" style={{ maxWidth:1120, margin:'0 auto',  padding: '60px 50px', display:'flex', justifyContent:'space-between'}}>
                <div>
                    <div style={{ width: 177 }}>
                        <img src="/img/logo-black.jpg" // 검정 로고 한 장만 사용
                            alt="로고" style={{
                                width: "100%",
                                filter: 'invert(100%)'
                            }}>
                        </img>
                    </div>
                    <div style={{ marginTop: 30, color: '#999', fontSize:12 }}>
                        <nav style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize:15 }}>
                            <Link style={{ textDecoration: 'none', color: '#999' }} to="/notices">공지사항</Link>
                            <div style={{ width: 1, height: 16, backgroundColor: '#999' }} />
                            <Link style={{ textDecoration: 'none', color: '#999' }} to="/datarooms">자료실</Link>
                        </nav>
                        <p style={{marginTop:20, marginBottom:0}}>company : (주)kikeum</p>
                        <p style={{marginBottom:0}}>고객센터 : 080-123-1234</p>
                        <p style={{marginBottom:0}}>address : 서울 강동구 천호대로157길 14 나비쇼핑몰 6층</p>
                        <p style={{marginBottom:0}}>privacy manager : 김미나</p>
                        <p style={{marginBottom:0}}>phone : 010-9216-7038</p>
                        <p style={{marginBottom:0}}>e-mail : alsk4325@naver.com</p>
                        <p>copyright © 2025 kk. All rights reserved.</p>
                    </div>
                </div>
                <div className="footer-right" style={{ color: '#999', fontSize:11, marginTop:65}}>
                    <h6 style={{color:'#fff', textAlign:'right'}}>opening hours.</h6>
                    <p style={{marginBottom:0, textAlign:'right'}}>T. 02-123-1234</p>
                    <p style={{marginBottom:0, textAlign:'right'}}>mon-fri / AM 10 - PM 6</p>
                    <p style={{marginBottom:0, textAlign:'right'}}>( sat sun holiday off )</p>
                    <p style={{marginBottom:0, textAlign:'right'}}>BANK INFO</p>
                    <p style={{marginBottom:0, textAlign:'right'}}>농협 302-1334-0364-31</p>
                    <p style={{marginBottom:0, textAlign:'right'}}>(주)kikeum</p>
                </div>
            </div>
        </div>
    )
}
