import { useState, useEffect } from 'react';
import '../styles/Menu.css';
import AddMenuModal from '../components/ModalMenu';
import { getMenus, addMenu, deleteMenu } from '../services/menu.service';
import chefGif from '../assets/chef.gif';
import deleteI from '../assets/deleteIconDisabled.svg';
import infoI from '../assets/info.png';

const Menu = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuSections, setMenuSections] = useState({ platos: [], bebestibles: [], postres: [] });
    const [newMenu, setNewMenu] = useState({ nombre: '', ingredientes: [], precio: '', tipo: '' });
    const [newIngredient, setNewIngredient] = useState({ nombre: '', cantidad: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const noNegative = (e) => {
        if (e.target.value < 0) {
            e.target.value = 1;
        }
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenus();
                const data = response.data;
                const platos = data.filter(item => item.tipo === 'Plato');
                const bebestibles = data.filter(item => item.tipo === 'Bebestible');
                const postres = data.filter(item => item.tipo === 'Postre');
                setMenuSections({ platos, bebestibles, postres });
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };

        fetchMenu();
    }, []);

    const handleAddMenu = async () => {
        try {
            const response = await addMenu(newMenu);
            setMenuSections(prevState => ({
                ...prevState,
                [newMenu.tipo.toLowerCase() + 's']: [...prevState[newMenu.tipo.toLowerCase() + 's'], response.data]
            }));
            setNewMenu({ nombre: '', ingredientes: [], precio: 1, tipo: '' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al agregar menú:', error);
        }
    };

    const handleAddIngredient = () => {
        setNewMenu(prevState => ({
            ...prevState,
            ingredientes: [...prevState.ingredientes, newIngredient]
        }));
        setNewIngredient({ nombre: '', cantidad: 1 });
    };

    const handleDeleteMenu = async (menuId, menuType) => {
        try {
            await deleteMenu(menuId);
            setMenuSections(prevState => ({
                ...prevState,
                [menuType.toLowerCase() + 's']: prevState[menuType.toLowerCase() + 's'].filter(item => item.id !== menuId)
            }));
        } catch (error) {
            console.error('Error al eliminar menu:', error);
        }
    };

    const handleMenuInfoClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="menu-container">
            <div className="marquee">
                <img src={chefGif} alt="Chef" className="chef" />
            </div>
            <h2>🧾 Menú del Restaurante 🍴</h2>
            <button className="add-menu-button" onClick={() => setIsModalOpen(true)}>Agregar Menú</button>

            <AddMenuModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newMenu={newMenu}
                setNewMenu={setNewMenu}
                newIngredient={newIngredient}
                setNewIngredient={setNewIngredient}
                handleAddIngredient={handleAddIngredient}
                handleAddMenu={handleAddMenu}
                noNegative={noNegative}
                />
                
            <div className="menu-sections">
                <div className="menu-section">
                    <h3>Platos</h3>
                    <ul className="menu-list">
                        {menuSections.platos.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                            >
                                {item.nombre}
                                <div className="menu-item-buttons">
                                <img src={infoI} alt="Información" className="info-button" onClick={() => handleMenuInfoClick(item)} />
                                    <img src={deleteI} alt="Eliminar" className="delete-icon" onClick={() => handleDeleteMenu(item.id, 'Plato')} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="menu-section">
                    <h3>Bebestibles</h3>
                    <ul className="menu-list">
                        {menuSections.bebestibles.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                            >
                                {item.nombre}
                                <div className="menu-item-buttons">
                                <img src={infoI} alt="Información" className="info-button" onClick={() => handleMenuInfoClick(item)} />
                                    <img src={deleteI} alt="Eliminar" className="delete-icon" onClick={() => handleDeleteMenu(item.id, 'Bebestible')} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="menu-section">
                    <h3>Postres</h3>
                    <ul className="menu-list">
                        {menuSections.postres.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${selectedItem === item ? 'selected' : ''}`}
                            >
                                {item.nombre}
                                <div className="menu-item-buttons">
                                    <img src={infoI} alt="Información" className="info-button" onClick={() => handleMenuInfoClick(item)} />
                                    <img src={deleteI} alt="Eliminar" className="delete-icon" onClick={() => handleDeleteMenu(item.id, 'Postre')} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {selectedItem && (
                <div className="selected-item-info">
                    <p>Seleccionaste: <strong>{selectedItem.nombre}</strong></p>
                    <h4 className="left-align">Sus ingredientes son:</h4>
                    <ul className="ingredients-list">
                        {selectedItem.ingredientes.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.nombre}: {ingredient.cantidad}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
};

export default Menu;