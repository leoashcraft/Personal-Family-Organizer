--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL
)

--
-- Data for table `users`
--

-- Note, the password used here will be "password" in plain text. 
-- bcrypt is used in this project for passwords.
  
INSERT INTO `users` (`user_id`, `username`, `email`, `first_name`, `last_name`, `password_hash`) VALUES
(1, 'user', 'user@email.com', 'John', Doe', '$2a$10$qAVq73R9OredJ5yoHaZN4OQ4wFLfzQHFz3YlP.39bu0IVFOhGG6Ou');
  
-- --------------------------------------------------------

--
-- Table structure for table `lists`
--

CREATE TABLE `lists` (
  `list_id` int NOT NULL,
  `user_id` int NOT NULL,
  `list_name` varchar(100) NOT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `list_order` int DEFAULT NULL,
  `category_id` int DEFAULT NULL
)

--
-- Data for table `lists`
--

INSERT INTO `lists` (`list_id`, `user_id`, `list_name`, `creation_date`, `last_modified`, `list_order`, `category_id`) VALUES
(1, 1, 'Costco', '2023-12-14 19:44:39', '2024-02-04 03:21:38', 1, 1),
(19, 1, 'Target', '2023-12-20 17:27:26', '2024-02-04 03:21:38', 2, 1),
(33, 1, 'Brookshires', '2023-12-21 17:02:28', '2024-02-04 03:21:38', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `list_categories`
--

CREATE TABLE `list_categories` (
  `category_id` int NOT NULL,
  `category_name` varchar(32) NOT NULL,
  `user_id` int NOT NULL,
  `category_order` int NOT NULL DEFAULT '0',
  `category_icon` varchar(32) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
)

--
-- Data for table `list_categories`
--

INSERT INTO `list_categories` (`category_id`, `category_name`, `user_id`, `category_order`, `category_icon`, `creation_date`, `last_modified`) VALUES
(1, 'Groceries', 1, 0, 'LocalGroceryStore', '2024-01-05 05:23:15', '2024-02-13 03:58:24'),
(2, 'Tasks', 1, 2, 'TaskAlt', '2024-01-05 05:24:41', '2024-02-13 03:58:25'),
(3, 'Work', 1, 3, 'Work', '2024-01-05 05:24:41', '2024-02-13 03:58:26'),
(4, 'School', 1, 1, 'School', '2024-01-05 05:24:41', '2024-02-13 03:58:25');

-- --------------------------------------------------------

--
-- Table structure for table `list_items`
--

CREATE TABLE `list_items` (
  `item_id` int NOT NULL,
  `list_id` int NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `status` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `notes` text,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `item_order` int NOT NULL DEFAULT '0'
)

--
-- Data for table `list_items`
--

INSERT INTO `list_items` (`item_id`, `list_id`, `item_name`, `status`, `priority`, `due_date`, `notes`, `creation_date`, `last_modified`, `item_order`) VALUES
(20, 33, 'Strawberries', NULL, NULL, NULL, NULL, '2023-12-20 17:27:47', '2024-02-19 03:02:07', 2),
(40, 1, 'Beef', NULL, NULL, NULL, NULL, '2023-12-21 17:07:56', '2024-02-19 05:22:51', 1),
(47, 1, 'Beans', NULL, NULL, NULL, NULL, '2023-12-20 17:27:47', '2024-02-19 05:22:51', 3),
(48, 1, 'Chicken', NULL, NULL, NULL, NULL, '2023-12-20 17:27:47', '2024-02-19 05:22:51', 0),
(49, 33, 'Blueberries', NULL, NULL, NULL, NULL, '2023-12-20 17:27:47', '2024-02-19 03:02:07', 0),
(50, 1, 'Lamb', NULL, NULL, NULL, NULL, '2023-12-21 17:07:56', '2024-02-19 05:22:51', 2),
(51, 33, 'White Fish', NULL, NULL, NULL, NULL, '2023-12-21 17:07:56', '2024-02-19 03:02:07', 1),
(52, 19, 'Pork', NULL, NULL, NULL, NULL, '2023-12-21 17:07:56', '2024-02-19 02:58:48', 2),
(53, 19, 'Rice', NULL, NULL, NULL, NULL, '2024-01-19 16:02:12', '2024-02-19 02:58:48', 5),
(54, 33, 'Berries', NULL, NULL, NULL, NULL, '2024-01-19 16:02:18', '2024-02-19 03:02:07', 3),
(55, 33, 'Granola', NULL, NULL, NULL, NULL, '2024-01-19 16:03:55', '2024-02-19 03:02:07', 4),
(56, 19, 'Greek Yogurt', NULL, NULL, NULL, NULL, '2024-01-19 16:04:46', '2024-02-19 02:58:48', 1),
(57, 19, 'Ketchup', NULL, NULL, NULL, NULL, '2024-01-19 16:06:40', '2024-02-19 02:58:48', 0),
(58, 19, 'Squash', NULL, NULL, NULL, NULL, '2024-01-21 02:49:55', '2024-02-19 02:58:48', 4),
(61, 1, 'Pasta', NULL, NULL, NULL, NULL, '2024-01-25 02:02:01', '2024-02-19 05:22:51', 4);

-- --------------------------------------------------------

--
-- Table structure for table `list_options`
--

CREATE TABLE `list_options` (
  `status` varchar(32) DEFAULT NULL,
  `priority` varchar(32) DEFAULT NULL
)

--
-- Data for table `list_options`
--

INSERT INTO `list_options` (`status`, `priority`) VALUES
('Upcoming', NULL),
('Pending', NULL),
('Overdue', NULL),
('Not started', NULL),
('Started', NULL),
('Active', NULL),
('Priority', NULL),
('Canceled', NULL),
(NULL, 'None'),
(NULL, 'Low'),
(NULL, 'Moderate'),
(NULL, 'High'),
(NULL, 'Extreme');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int NOT NULL,
  `user_id` int NOT NULL,
  `recipe_name` varchar(100) NOT NULL,
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `recipe_order` int DEFAULT '0',
  `course_id` int DEFAULT NULL
)

--
-- Data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `user_id`, `recipe_name`, `creation_date`, `last_modified`, `recipe_order`, `course_id`) VALUES
(2, 1, 'Squash and Eggs', '2024-02-13 05:37:37', '2024-02-13 05:37:37', 0, 1),
(3, 1, 'Avocado Deviled Eggs', '2024-02-13 05:37:37', '2024-02-13 05:37:37', 0, 2),
(4, 1, 'Mexican Casserole', '2024-02-13 05:37:37', '2024-02-13 05:37:37', 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_courses`
--

CREATE TABLE `recipe_courses` (
  `course_id` int NOT NULL,
  `course_name` varchar(32) NOT NULL,
  `user_id` int NOT NULL,
  `course_order` int NOT NULL DEFAULT '0',
  `course_icon` varchar(32) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
)

--
-- Data for table `recipe_courses`
--

INSERT INTO `recipe_courses` (`course_id`, `course_name`, `user_id`, `course_order`, `course_icon`, `creation_date`, `last_modified`) VALUES
(1, 'Breakfast', 1, 0, 'EggIcon', '2024-02-13 05:32:15', '2024-02-13 05:32:15'),
(2, 'Lunch', 1, 0, 'LunchDiningIcon', '2024-02-13 05:32:15', '2024-02-13 05:32:15'),
(3, 'Dinner', 1, 0, 'DinnerDiningIcon', '2024-02-13 05:32:15', '2024-02-13 05:32:15');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_ingredients`
--

CREATE TABLE `recipe_ingredients` (
  `ingredient_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `ingredient_name` varchar(100) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ingredient_order` int NOT NULL DEFAULT '0'
)

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `user_id` int NOT NULL
)

--
-- Data for table `user_settings`
--

INSERT INTO `user_settings` (`user_id`) VALUES
(1);

--
-- Indexes for tables
--

--
-- Indexes for table `lists`
--
ALTER TABLE `lists`
  ADD PRIMARY KEY (`list_id`),
  ADD KEY `fk_lists_users` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `list_categories`
--
ALTER TABLE `list_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `list_items`
--
ALTER TABLE `list_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `fk_list_items_lists` (`list_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `fk_lists_users` (`user_id`),
  ADD KEY `course_id` (`course_id`) USING BTREE;

--
-- Indexes for table `recipe_courses`
--
ALTER TABLE `recipe_courses`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `fk_user_id` (`user_id`) USING BTREE;

--
-- Indexes for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD PRIMARY KEY (`ingredient_id`),
  ADD KEY `fk_recipe_id` (`recipe_id`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for tables
--

--
-- AUTO_INCREMENT for table `lists`
--
ALTER TABLE `lists`
  MODIFY `list_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `list_categories`
--
ALTER TABLE `list_categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `list_items`
--
ALTER TABLE `list_items`
  MODIFY `item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `recipe_courses`
--
ALTER TABLE `recipe_courses`
  MODIFY `course_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  MODIFY `ingredient_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for tables
--

--
-- Constraints for table `lists`
--
ALTER TABLE `lists`
  ADD CONSTRAINT `fk_lists_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `list_categories` (`category_id`);

--
-- Constraints for table `list_categories`
--
ALTER TABLE `list_categories`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `list_items`
--
ALTER TABLE `list_items`
  ADD CONSTRAINT `fk_list_items_lists` FOREIGN KEY (`list_id`) REFERENCES `lists` (`list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
