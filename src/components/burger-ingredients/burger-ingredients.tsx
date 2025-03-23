import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer'; //хук отслеживает, находится ли элемент в зоне видимости (viewport).

import { TIngredient, TTabMode } from '@utils-types'; //Тип, определяющий возможные значения вкладок ('bun', 'main', 'sauce')
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/stellar-burger-slice';

//Компонент BurgerIngredients отвечает за отображение и управление вкладками с ингредиентами бургера.
export const BurgerIngredients: FC = () => {
  /** TODO: взять переменные из стора */
  const ingredients = useSelector(selectIngredients);

  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  //Состояние, которое хранит текущую активную вкладку ('bun', 'main', 'sauce'). По умолчанию выбрана вкладка 'bun'
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  //Ссылки на DOM-элементы заголовков разделов (булки, начинки, соусы). Используются для плавной прокрутки к соответствующему разделу
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  //Отслеживание видимости разделов. Булевы значения, указывающие, виден ли соответствующий раздел в viewport.
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  //отслеживает изменения видимости разделов и автоматически переключает вкладку (currentTab) в зависимости от того, какой раздел виден в viewport
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  //Обработчик клика по вкладке. Устанавливает текущую вкладку (currentTab). Прокручивает страницу к соответствующему разделу с плавной анимацией (scrollIntoView).
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
