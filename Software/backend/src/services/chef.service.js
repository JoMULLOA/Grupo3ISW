import { AppDataSource } from "../config/configDb.js";
import { getPedidos } from "./pedido.service.js";
import { removePedido } from "./pedido.service.js";
import { getIngredientes } from "./ingrediente.service.js";
import { getMenus } from "./menu.service.js";
import ingrediente from "../entity/ingrediente.entity.js";


export const preparapedido = async (pedidoId, nuevoEstado) => {
    try {
        const pedidoRepository = AppDataSource.getRepository(Pedido);
        const pedido = await pedidoRepository.findOne({ where: { id: pedidoId } });

        if (pedido) {
            pedido.status = nuevoEstado;
            await pedidoRepository.save(pedido);
            console.log(`Estado del pedido con ID ${pedidoId} actualizado a ${nuevoEstado}`);
        } else {
            console.log(`No se encontró el pedido con ID ${pedidoId}`);
        }
    } catch (error) {
        console.error("Error al actualizar el estado del pedido:", error);
    }
};



export const CancelarPedido = async (prepararpedido) => {
    try {
        const pedidos = await getPedidos();
        const menus = await getMenus();
        const ingredientesEs = await getIngredientes();
        const ingredientRepository = AppDataSource.getRepository(ingrediente);
        console.log("prepararpedido=", prepararpedido);

        // Encontrar el pedido específico basado en las propiedades del `prepararpedido`
        const pedido = pedidos.find(p => p.id === prepararpedido.id);

        for (const plato of pedido.plato) { // Itera sobre los platos del pedido
            const menu = menus.find(a => a.nombre === plato);
            for (const ingrediente of menu.ingredientes) {
                const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
                if (!ingre) {
                    console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                    continue;
                }
                ingre.cantidad += ingrediente.cantidad; // Actualiza la cantidad
                await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
            }
        }

        //bebesible
        for (const bebestible of pedido.bebestible) { // Itera sobre los platos del pedido
            const menu = menus.find(a => a.nombre === bebestible);
            for (const ingrediente of menu.ingredientes) {
                const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
                if (!ingre) {
                    console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                    continue;
                }
                ingre.cantidad += ingrediente.cantidad; // Actualiza la cantidad
                await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
            }
        }
        //postre

        for (const postre of pedido.postre) { // Itera sobre los platos del pedido
            const menu = menus.find(a => a.nombre === postre);
            for (const ingrediente of menu.ingredientes) {
                const ingre = ingredientesEs.find(ing => ing.nombre === ingrediente.nombre);
                if (!ingre) {
                    console.log(`No se encontró el ingrediente: ${ingrediente.nombre}`);
                    continue;
                }
                ingre.cantidad += ingrediente.cantidad; // Actualiza la cantidad
                await ingredientRepository.save(ingre); // Guarda el cambio en la base de datos
            }
        }
        await removePedido(pedido.id);
        console.log(`Pedido con ID ${pedido.id} eliminado con éxito.`);

    } catch (error) {
        console.log("Error al procesar el pedido:", error.message);
    }
};
