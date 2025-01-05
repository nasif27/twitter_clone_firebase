import { useEffect } from "react";
import { Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import ProfileSideBar from "../components/ProfileSideBar";
import ProfileMidBody from "../components/ProfileMidBody";

export default function ProfilePage({apiURL}) {
    const [authToken, setAuthToken] = useLocalStorage('authToken', '');
    const navigate = useNavigate();

    // Check for authToken immediately upon component mount and whenever authToken changes
    useEffect(() => {
        if (!authToken) {
            navigate('/login'); // Redirect to login page if no auth token is present
        }
    }, [authToken, navigate]);

    const handleLogout = () => {
        setAuthToken('');   // Clear token from localStorage
    };

    return (
        <>
            <Container className="mt-3">
                <Row>
                    <ProfileSideBar handleLogout={handleLogout} apiURL={apiURL} />
                    <ProfileMidBody apiURL={apiURL} />
                </Row>
            </Container>
        </>
    );
}