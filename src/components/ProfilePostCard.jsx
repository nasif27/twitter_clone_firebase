import { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ProfilePostCard({content, postId, apiURL}) {
    const pic = " https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

    // const [likes, setLikes] = useState(0);   // Twitter Clone Part 3
    
    // Twitter Clone Part 4
    const [likes, setLikes] = useState([]);

    // Decoding to get the userId
    const token = localStorage.getItem('authToken');
    const decode = jwtDecode(token);
    const userId = decode.id;

    useEffect(() => {
        fetch(`${apiURL}/likes/post/${postId}`)
            .then((response) => response.json())
            // .then((data) => setLikes(data.length))   // Twitter Clone Part 3
            .then((data) => setLikes(data))     // Twitter Clone Part 4
            .catch((error) => console.error("Error", error));
    }, [apiURL, postId]);

    const isLiked = likes.some((like) => like.user_id === userId);

    const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

    const addToLikes = () => {
        axios.post(`${apiURL}/likes`, {
            user_id: userId,
            post_id: postId,
        })
        .then((response) => {
            setLikes([...likes, {...response.data, likes_id: response.data.id}]);
        })
        .catch((error) => console.log('Error:', error))
    };

    const removeFromLikes = () => {
        const like = likes.find((like) => like.user_id === userId);

        if (like) {
            axios
                .put(`${apiURL}/likes/${userId}/${postId}`)    // Include userId and postId in the URL
                .then(() => {
                    // Update the state to reflect the removal of the like
                    setLikes(likes.filter((likeItem) => likeItem.user_id !== userId));
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    return (
        <Row
            className="p-3"
            style={{
                borderTop: "1px solid #D3D3D3",
                borderBottom: "1px solid #D3D3D3"
            }}
        >
            <Col sm={1}>
                <Image src={pic} fluid roundedCircle />
            </Col>

            <Col>
                <strong>Nasif</strong>
                <span> @nasif.abdullah • Mar 16</span>
                <p>{content}</p>
                <div className="d-flex justify-content-between">
                    <Button variant="light">
                        <i className="bi bi-chat"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-repeat"></i>
                    </Button>
                    <Button variant="light" onClick={handleLike}>
                        {isLiked ? (
                            <i className="bi bi-heart-fill text-danger"></i>
                        ) : (
                            <i className="bi bi-heart"></i>
                        )}
                        {likes.length}
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-graph-up"></i>
                    </Button>
                    <Button variant="light">
                        <i className="bi bi-upload"></i>
                    </Button>
                </div>
            </Col>

        </Row>
    );
}