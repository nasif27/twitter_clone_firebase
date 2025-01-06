import { getAuth } from "firebase/auth";
import { useContext } from "react";
import { Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import ProfileSideBar from "../components/ProfileSideBar";
import ProfileMidBody from "../components/ProfileMidBody";

export default function ProfilePage() {
    const auth = getAuth();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    // Check if currentUser is logged in
    if (!currentUser) {
        navigate('/login'); // Redirect to login page if user not logged in
    }
    
    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <>
            <Container className="mt-3">
                <Row>
                    <ProfileSideBar handleLogout={handleLogout} />
                    <ProfileMidBody />
                </Row>
            </Container>
        </>
    );
}