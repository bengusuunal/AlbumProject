import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import styled from "styled-components";

const RecentAlbums = () => {
    const [recentAlbums, setRecentAlbums] = useState([]);

    useEffect(() => {
        const storedAlbums = JSON.parse(localStorage.getItem("recentAlbums")) || [];
        console.log('Stored Albums:', storedAlbums);
        setRecentAlbums(storedAlbums);

        const intervalId = setInterval(() => {
            const updatedAlbums = JSON.parse(localStorage.getItem("recentAlbums")) || [];
            console.log('Updated Stored Albums:', updatedAlbums);
            setRecentAlbums(updatedAlbums);
        }, 3000);

        return () => clearInterval(intervalId);

    }, []);

    const StyledCard = styled(Card)`
      height: 150px;
      background-color: ${({ theme }) => theme.tableBackground}; 
      color: ${({ theme }) => theme.text}; 
      border: 1px solid ${({ theme }) => theme.default} 
    `;

    return (
        <div style={{ padding: "20px", marginTop: "5px", marginBottom: "20px" }}>
            {recentAlbums.length > 0 && (
                <>
                    <h2>Recently Viewed Albums</h2>
                    <Row gutter={[16, 16]}>
                        {recentAlbums.map((item, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={4}>
                                <StyledCard hoverable>
                                    <h4>Album {item.album.id}</h4>
                                    <p>{item.album.title}</p>
                                </StyledCard>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>

    );
};

export default RecentAlbums;
