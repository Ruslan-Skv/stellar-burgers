import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { selectConstructorItems } from '../../slices/stellar-burger-slice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  /** TODO: взять переменную из стора */
  const burgerConstructor = useSelector(selectConstructorItems);

  const ingredientsCounters = useMemo(() => {
    // Деструктуризация burgerConstructor для получения булки и ингредиентов
    const { bun, ingredients } = burgerConstructor;
    // Объект counters для хранения количества каждого ингредиента
    const counters: { [key: string]: number } = {};
    // Перебираем ингредиенты в конструкторе бургера
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0; // Если ингредиент еще не был добавлен в counters, инициализируем его нулем
      counters[ingredient._id]++; // Увеличиваем счетчик для текущего ингредиента
    });
    if (bun) counters[bun._id!] = 2; // Если булка существует, устанавливаем счетчик для булки равным 2
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
