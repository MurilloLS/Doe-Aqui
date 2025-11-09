import { useNavigate } from 'react-router-dom';
import './Header.css';
import categories from './CategoriesList';

function Categories({ handleCategory }) {
    const navigate = useNavigate();

    const handleClick = (item) => {
        if (handleCategory) {
            handleCategory(item);
        } else {
            navigate('/category/' + item);
        }
    }

    return (
        <div className='cat-container'>
            <div>
                <span className='pr-3'>Categorias: </span>
                {categories.map((item, index) => (
                    <span onClick={() => handleClick(item)} key={index} className='category'> {item} </span>
                ))}
            </div>
        </div>
    );
}

export default Categories;