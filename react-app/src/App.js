import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LikedProductsProvider } from './contexts/LikedProductsContext';
import { Toaster } from 'react-hot-toast';

// Importar as PÁGINAS
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AddProductPage from './pages/AddProductPage';
import LikedProductsPage from './pages/LikedProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import MyProductsPage from './pages/MyProductsPage';
import MyProfilePage from './pages/MyProfilePage';
import EditProductPage from './pages/EditProductPage';
import EditProfilePage from './pages/EditProfilePage';
import ChatPage from './pages/ChatsPage';

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/category/:catName", element: <CategoryPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/add-product", element: <AddProductPage /> },
    { path: "/liked-products", element: <LikedProductsPage /> },
    { path: "/my-products", element: <MyProductsPage /> },
    { path: "/product/:productId", element: <ProductDetailPage /> },
    { path: "/my-profile", element: <MyProfilePage /> },
    { path: "/edit-product/:productId", element: <EditProductPage /> },
    { path: "/edit-profile", element: <EditProfilePage /> },
    { path: "/chats", element: <ChatPage/> },
]);

function App() {
    return (
        <LikedProductsProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" reverseOrder={false} />
        </LikedProductsProvider>
    );
}

export default App;