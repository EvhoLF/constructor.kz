# Konstruktor

**Konstruktor** — это веб-платформа для визуализации данных, построения схем, воронок и канбан-досок с возможностью работы с формулами для бизнес-процессов.  

---

## ⚡ Основной функционал

1. **Онтологии**
   - Форматы формул: `*C1(+C1.1*C1.2)~C2`
     - `*` — обязательно
     - `+` — необязательно
     - `()` — дочерние элементы
     - `~` — вариант/альтернатива
   - Визуализация блоков с настройками:
     - Заголовок, цвет фона и обводки, иконка
     - Авторазмер, ширина/высота, скрытие заголовка
   - Двусторонняя связь: изменения формулы ↔ изменения схемы
   - Импорт блоков и схем из шаблонов

2. **Создание схем без формул**
   - Визуальный редактор блок-схем
   - Настройка блоков, размеров, цветов

3. **Шаблоны схем**
   - С формулами и без формул
   - Админка для создания и редактирования шаблонов
   - Вставка блоков или целых схем в обычные диаграммы

4. **Воронки**
   - Слои и описание слоев
   - Настройка направления, размера и центрирования

5. **Канбан-доска**
   - Перетаскивание колонок и карточек
   - Настройка стиля и блоков
   - Подобна доске Bitrix24

---

## 🛠 Технологический стек

- **Фронтенд:** React 19, Next.js 15, MUI 7, Emotion, XYFlow
- **Взаимодействие с пользователем:** DnD-kit, use-debounce
- **Бэкенд:** Next.js API routes
- **База данных:** MySQL через Prisma ORM
- **Прочее:** zod (валидация), lz-string (сжатие данных), jsPDF, dom-to-image/html-to-image
- **CI/CD:** GitHub Actions, Docker, Docker Compose

---

## 📦 Структура проекта

- app/ # Страницы Next.js
- components/ # UI и редакторы (Diagram, Funnel, Kanban)
- hooks/ # Кастомные хуки
- Icons/ # Набор иконок для блоков
- utils/ # Вспомогательные функции (формулы, экспорт)
- prisma/ # Prisma схема и миграции
- styles/ # MUI тема и переменные
- public/ # Статические ресурсы (иконки, изображения)

---

## 🗄 База данных (Prisma)
- **Diagram** — схемы
- **Ontology** — онтологии
- **Funnel** — воронки
- **Kanban** — канбан-доски
- **TemplateDiagram / TemplateOntology** — шаблоны схем
- **User** — пользователи с ролями (user/admin)

> Все графы (nodes и edges) хранятся в сжатом формате

---

## 🚀 Развёртывание проекта

Ниже описан **ПРИМЕРНЫЙ** процесс запуска проекта **Konstruktor** как в локальной среде, так и на продакшн-сервере с Docker и Docker Compose.


### 1️⃣ Локальная разработка

1. Клонировать репозиторий:

```bash
git clone <repo_url>
cd konstruktor
````

2. Установить зависимости:

```bash
npm install
```

3. Настроить файл `.env`:

```env
NEXTAUTH_SECRET=YOUR_SECRET
SECRET=YOUR_SECRET
NEXT_PUBLIC_BASE_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:8080
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

4. Сгенерировать Prisma клиент и применить миграции:

```bash
npx prisma generate
npx prisma migrate dev
```

5. Запустить проект в режиме разработки:

```bash
npm run dev
```

6. Для продакшн-сборки:

```bash
npm run build
npm start
```

> Приложение будет доступно по адресу `http://localhost:8080`.

---

### 2️⃣ Развёртывание на сервере с Docker

#### Подготовка

1. На сервере установить Docker и Docker Compose:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker
```

2. Скопировать проект на сервер (или использовать CI/CD через GitHub Actions).

---

#### Настройка `.env` на проде

Создать файл `/var/www/konstruktor__usr/data/.env` со следующими переменными:

```env
NEXTAUTH_SECRET=ZXCCONSSEC2025
SECRET=ZXCCONSSEC2025
NEXT_PUBLIC_BASE_URL=http://185.125.90.92:8080
NEXTAUTH_URL=http://185.125.90.92:8080
DATABASE_URL=mysql://konstruktor_:5yeWcbNiqg3snYd3@127.0.0.1:3306/konstruktor_
```

> Важно: **не публикуйте эти данные публично**, храните их безопасно.

---

#### Настройка `docker-compose.yml`

```yaml
services:
  konstruktor-app:
    build: .
    image: konstruktor:latest
    network_mode: host
    restart: always
    env_file:
      - .env
```

**Примечания:**

* `network_mode: host` позволяет контейнеру использовать локальную сеть сервера, чтобы обращаться к MySQL на `127.0.0.1`.
* `restart: always` обеспечивает автоматический перезапуск при сбое.
* `env_file: .env` подгружает все необходимые переменные окружения.

---

### 3️⃣ Запуск на проде

1. Перейти в директорию проекта:

```bash
cd /var/www/konstruktor__usr/data/
```

2. Поднять контейнер через Docker Compose:

```bash
docker compose up -d --build
```

3. Применить миграции Prisma (если нужно):

```bash
docker run --rm --network host --env-file .env konstruktor:latest npx prisma migrate deploy
```

4. Проверить статус контейнера:

```bash
docker ps
```

> Приложение будет доступно по адресу: `http://185.125.90.92:8080`.

---

### 4️⃣ Обновление продакшн-версии

1. Собрать новый Docker-образ локально или через CI/CD:

```bash
docker build -t konstruktor:latest .
```

2. Загрузить образ на сервер (или через GitHub Actions).

3. Перезапустить контейнер:

```bash
docker compose down
docker compose up -d --force-recreate
```

4. Очистить старые образы (по желанию):

```bash
docker image prune -af
```

---

### 5️⃣ Полезные советы

* Всегда храните `.env` в защищённом месте, не коммитьте в репозиторий.
* Для локального MySQL используйте отдельную БД для разработки и продакшна.
* При изменении структуры Prisma моделей всегда сначала делайте `npx prisma generate`, затем `npx prisma migrate dev` (локально) или `npx prisma migrate deploy` (на проде).
* Для бэкапа MySQL используйте `mysqldump` или встроенные инструменты хостинга.

---