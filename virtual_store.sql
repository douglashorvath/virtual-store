-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 20/11/2024 às 22:49
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `virtual_store`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `units` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `products`
--

INSERT INTO `products` (`id`, `name`, `units`, `price`, `image`) VALUES
(1, 'Mouse Gamer RGB', 13, 120.00, 'https://http2.mlstatic.com/D_NQ_NP_916293-MLB76747490319_052024-O.webp'),
(2, 'Teclado Mecânico RGB', 7, 250.00, 'https://images.kabum.com.br/produtos/fotos/105009/teclado-mecanico-gamer-hyperx-alloy-origins-core-rgb-hx-kb7rdx-br_1574693479_g.jpg'),
(3, 'Headset Gamer', 7, 350.00, 'https://images.tcdn.com.br/img/img_prod/406359/headphone_gamer_para_ps4_pc_celular_com_microfone_articulado_led_rgb_7_cores_almofada_extra_macia_gh_2781_1_fc011894f2d7616f79077d57564e82eb_20220707114640.jpeg'),
(4, 'Monitor 24\" Full HD', 5, 900.00, 'https://images.tcdn.com.br/img/img_prod/15959/monitor_24_lg_full_hd_hdmi_24mp400_b_18339_1_f0f07ba5e90257af9a4374866278c9df.jpg'),
(5, 'Notebook i5 8GB RAM', 3, 3200.00, 'https://a-static.mlcdn.com.br/1500x1500/notebook-acer-aspire-5-intel-core-i5-12450h-8gb-ram-512gb-ssd-156-full-hd-windows-11-a515-57-565j/magazineluiza/237866400/00db0856da2536c633f5bf3085c874c5.jpg'),
(6, 'Smartphone 128GB', 7, 2500.00, 'https://t62533.vteximg.com.br/arquivos/ids/943166-1000-1000/A24-.jpg?v=638283105211500000'),
(7, 'Câmera Web Full HD', 12, 180.00, 'https://cirilocabos.vtexassets.com/arquivos/ids/188823-800-800?v=638507032191530000&width=800&height=800&aspect=true'),
(8, 'Carregador Portátil 20000mAh', 20, 150.00, 'https://a-static.mlcdn.com.br/800x560/carregador-portatil-power-bank-geonav-20000mah-pb20kbk/magazineluiza/224632900/263bf6bfa40f734e1b3f5fb7884e6a2f.jpg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `units` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `purchases`
--

INSERT INTO `purchases` (`id`, `user_id`, `product_id`, `units`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 1, 3, 1),
(4, 1, 1, 1),
(5, 1, 2, 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'João Silva', 'joao.silva@example.com', 'senha123'),
(2, 'Maria Oliveira', 'maria.oliveira@example.com', '123maria'),
(3, 'Carlos Eduardo', 'carlos.eduardo@example.com', 'eduardo321');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
