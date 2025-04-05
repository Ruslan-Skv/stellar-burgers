import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/stellar-burger-slice';
import { useNavigate, useParams } from 'react-router-dom';

//React-компонент отображает детали ингредиента на основе его id, переданного в URL.
export const IngredientDetails: FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>(); // Хук для получения параметров из URL (в данном случае `id` ингредиента)

  useEffect(() => {
    if (!params.id) {
      navigate('/', { replace: true });
    }
  }, []);

  /** TODO: взять переменную из стора */
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === params.id); // Находим данные ингредиента по его `id`

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
