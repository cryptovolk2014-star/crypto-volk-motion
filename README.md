# Crypto Volk Motion Engine

## Новый ролик: От сомнений к ясности / Scan AI

**39,5 с · 1080×1920 · 30 fps.** Два оригинальных видео трейдера, новая озвучка, переход DARK → LIGHT на фразе «меньше одной минуты» и непрерывная демонстрация EUR/USD: выбор пары → срок торговли → AI-анализ → вход, стоп, цели и логика. Предыдущие ролики сохранены.

```sh
npm ci --cache .npm-cache
npm start
```

Просмотр: `http://localhost:4173/composition.html?composition=scan-ai-emotion`.

```sh
npm run check:emotion
npm run stills:emotion
npm run render:emotion
npm run check:emotion:media
```

MP4: `output/crypto-volk-scan-ai-emotion.mp4`. Превью: `output/scan-ai-emotion/`. Таймлайн: `compositions/scan-ai-emotion.json`. Инструкции, редактирование сцен и отчёт: [docs/scan-ai-emotion.md](docs/scan-ai-emotion.md). Нужны Node.js, Chromium и FFmpeg; для контактного листа — Python + Pillow (`python scripts/contact-sheet.py --composition=scan-ai-emotion`).

---

## Новый ролик: Нефть / Scan AI / DARK

**26,7 с · 1080×1920 · 30 fps.** Новый нефтяной хук, новая озвучка и демонстрация плана сделки в тёмном премиальном стиле первых роликов. Вход, цель и риск раскрываются по речи; финал предлагает три бесплатных анализа. Все предыдущие версии сохранены.

```sh
npm ci --cache .npm-cache
npm start
```

Просмотр: `http://localhost:4173/composition.html?composition=scan-ai-oil`.

```sh
npm run check:oil
npm run stills:oil
npm run render:oil
npm run check:oil:media
```

Видео: `output/crypto-volk-scan-ai-oil.mp4`. Превью: `output/scan-ai-oil/`. Таймлайн: `compositions/scan-ai-oil.json`. Инструкции, тайминги и отчёт об изменениях: [docs/scan-ai-oil.md](docs/scan-ai-oil.md). Требуются Node.js, Chromium и FFmpeg. Для контактного листа: `python scripts/contact-sheet.py --composition=scan-ai-oil` (Pillow).

---

## Ethereum / DARK — исправленная версия

**35,5 с · 1080×1920 · 30 fps.** Весь ролик переведён в тёмную палитру, включая экран iPhone и все панели. Масштаб правой руки исправлен: оба жеста теперь соответствуют размеру удерживающей руки. Озвучка и предыдущие версии сохранены.

```sh
npm ci --cache .npm-cache
npm start
```

Просмотр: `http://localhost:4173/composition.html?composition=scan-ai-ethereum-dark`.

```sh
npm run check:ethereum:dark
npm run stills:ethereum:dark
npm run render:ethereum:dark
npm run check:ethereum:dark:media
```

MP4: `output/crypto-volk-scan-ai-ethereum-dark.mp4`. Превью, контактный лист и отдельный лист двух исправленных нажатий: `output/scan-ai-ethereum-dark/`. Подробности: [docs/scan-ai-ethereum-dark.md](docs/scan-ai-ethereum-dark.md). Для запуска нужны Node.js, Chromium и FFmpeg.

---

## Новый ролик: Ethereum на ладони

**35,5 с · 1080×1920 · 30 fps.** Новая озвучка, оригинальные прозрачные плашки, переход DARK → LIGHT и iPhone в левой руке с нажатиями правой. Программный интерфейс показывает ETH/USDT → AI-анализ → демонстрационный LONG-сценарий. Предыдущие ролики сохранены.

```sh
npm ci --cache .npm-cache
npm start
```

Просмотр: `http://localhost:4173/composition.html?composition=scan-ai-ethereum`.

```sh
npm run check:ethereum
npm run stills:ethereum
npm run render:ethereum
npm run check:ethereum:media
```

Видео: `output/crypto-volk-scan-ai-ethereum.mp4`. Превью и контактные листы: `output/scan-ai-ethereum/`. Тайминги, происхождение слоёв рук, инструкции редактирования и отчёт: [docs/scan-ai-ethereum.md](docs/scan-ai-ethereum.md).

Нужны Node.js, Chromium и FFmpeg. Тексты рендерятся настоящими шрифтами, минимальный кегль — 36 px. Два пользовательских изображения служат референсами позы и ракурса; их интерфейс не используется. Новые слои рук и телефона подготовлены отдельно; оригинальные брендовые изображения сохранены.

---

## Новая версия Scan AI: DARK → LIGHT

Новая отдельная композиция с новой озвучкой, сценой «Как поступить правильно?» и сканирующим переходом в светлую тему на слове «Смотри». **46,5 с · 1080×1920 · 30 fps**. Предыдущие ролики сохранены.

```sh
npm ci --cache .npm-cache
npm start
```

Просмотр: `http://localhost:4173/composition.html?composition=scan-ai-clarity`.

```sh
npm run check:clarity
npm run stills:clarity
npm run render:clarity
```

Видео: `output/crypto-volk-scan-ai-clarity.mp4`. Превью всех сцен, отдельный контактный лист DARK → LIGHT и отчёты: `output/scan-ai-clarity/`. Полное описание изменений, таймингов и редактирования: [docs/scan-ai-clarity.md](docs/scan-ai-clarity.md).

Для запуска нужны Node.js, Chromium и FFmpeg. Новая дорожка сохранена целиком (44,513 с), финал дополнен коротким удержанием. Очищенные оригинальные логотипы и Scan AI используются с прозрачностью; мелкий текст — от 36 px. Светлая тема адаптирует всю графику и контраст подписей.

---

## Предыдущий ролик: Scan AI — продукт и логика сценария

Новая отдельная композиция `scan-ai-product` использует дизайн успешной версии Rebuild 02. Прежние ролик, озвучка, плеер и движок сохранены.

- Новый MP4: `output/crypto-volk-scan-ai-product.mp4`.
- Контактный лист: `output/scan-ai-product/contact-sheet.jpg`.
- Четыре этапа продукта: `output/scan-ai-product/product-journey.jpg`.
- Исходный сценарий и фактические речевые тайминги: `compositions/scan-ai-product-script.txt`, `compositions/scan-ai-product-words.json`.
- Сцены: `compositions/scan-ai-product.js`; границы сцен, события и экспорт: `compositions/scan-ai-product.json`.
- Переиспользуемый продуктовый путь: `components/trading-setup.js` → `createMarketToSetup(engine, {events, setup})`.

```sh
npm ci
npm start
```

Для нового ролика откройте страницу `/composition.html?composition=scan-ai-product` на локальном сервере порта 4173. Главная страница по-прежнему воспроизводит предыдущий ролик о золоте.

```sh
npm run check:product
npm run stills:product
npm run render:product
```

1080×1920, 30 fps, H.264/AAC. Новая озвучка: 42,109375 с; полный ролик: 44 с, включая 1,890625 с тишины в конце для удержания CTA. Старые таймкоды не использованы. Графика ориентируется на границы слов новой записи; разрешение исходной ASR-разметки — 40 мс, отрисовка — 1/30 с. Слова озвучки не заменяются текстом автоматического распознавания: хранится канонический сценарий пользователя.

Основные заголовки остаются крупными, UI-текст — от 36 px, обычно 38–46 px. Используются настоящие Montserrat и Roboto Mono, загружаемые локально. Прозрачные PNG из Rebuild 02 проверяются до экспорта. Оригинальные неочищенные изображения в монтаж не попадают.

Демонстрационный BTC/USDT LONG: ENTRY 100 000, STOP LOSS 99 000, TAKE PROFIT 1/2/3 — 101 000 / 102 000 / 103 000. Это стилизованный демонстрационный интерфейс, а не реальная котировка или точный скриншот продукта. На видео он отмечен как «ДЕМО».

Сцены редактируются независимо в функциях композиции. Чтобы менять продуктовый путь или цены, корректируйте параметры `createMarketToSetup` и `DEMO_SETUP`, сохраняя проверяемую логику уровней. Новые композиции используют общие компоненты `components/fintech.js`, выделенные из утверждённого движка без замены его визуального языка.

Подробности: `docs/scan-ai-product.md`. Для рендера нужны Node.js 24, Chromium и FFmpeg с libx264; модели распознавания речи для воспроизведения и рендера не требуются. Промежуточные PNG, кэши, зависимости и ZIP исключены из Git; итоговые MP4 и контактные листы сохраняются в репозитории.

---

## Предыдущая композиция: золото — Rebuild 02

Полная пересборка всех восьми сцен ролика об AI-анализе золота. Формат 1080×1920, 30 fps, 755 кадров. Исходная озвучка длится 25,156 секунды; MP4 занимает 25,167 секунды по сетке кадров, как и предыдущая версия. Последовательность сцен, их границы, CTA и озвучка сохранены.

## Что переделано

- Заново собраны композиции всех восьми сцен: рынок золота, два направления, AI-анализ, выбор актива в Telegram, сценарии и уровни, проверка своего актива, три бесплатных сигнала, финальный CTA.
- Логотип Crypto Volk теперь используется без квадратного фона: отдельно видны волк, CRYPTOVOLK и TRADE.
- Scan AI вырезан по скруглённому неоновому контуру. Удалён внешний прямоугольный фон; сохранены сама панель, её внутренняя поверхность, надписи и свечение.
- Мелкий текст увеличен по всему ролику. Минимальный размер текста движка — 32 px; технические строки, второстепенные описания и UI-лейблы обычно 34–40 px, основные подписи 44 px. Геометрический Montserrat Medium/Semibold заменяет прежние тонкие микроподписи; Roboto Mono Semibold используется для тикеров и времени.
- Крупные заголовки сохраняют близкий масштаб и Montserrat ExtraBold. Типографика после появления стабилизируется; движение остаётся в графике, орбитах и интерфейсных переходах.
- Новая компоновка графиков, уровней и карточек оставляет место увеличенным подписям. Фирменная палитра: Navy `#050718`, Ivory `#F3EFE9`, Violet `#7A52EE`, Cyan `#5FCDC9`.

## Прозрачные фирменные материалы

В монтаж поступают только:

- `assets/brand/clean/cryptovolk-logo.png` — логотип с реальной альфа-прозрачностью;
- `assets/brand/clean/scan-ai-plate.png` — скруглённая неоновая плашка с прозрачностью снаружи;
- `assets/brand/clean/manifest.json` — размеры, способ извлечения и контрольные суммы.

Исходные PNG в `assets/brand/` сохранены без изменения. Прозрачные производные получены детерминированно, без AI-генерации и без перерисовки надписей: у логотипа удалена однотонная navy-подложка, у плашки применена маска внешнего скруглённого контура с мягким спадом свечения. Свойства альфа-канала проверяются автоматически. Внутренняя тёмная поверхность самой плашки остаётся частью оригинального дизайна.

Повторная подготовка из оригиналов:

```sh
npm run prepare:brand
```

## Запуск

Требуются Node.js 24, FFmpeg с libx264 и Chromium. В текущей облачной среде они уже установлены. После клонирования проекта:

```sh
cd crypto-volk-motion
npm ci
npm start
```

В браузере откройте локальный сервер порта 4173, нажмите «Воспроизвести со звуком». Слайдер перематывает анимацию вместе с голосом. Порт меняется через `PORT`. В подготовленной облачной среде checkout — `/workspace/crypto-volk-motion`; при необходимости используйте `npm ci --cache .npm-cache`.

## Проверка и экспорт

```sh
npm run check
npm run stills
npm run render
```

- `npm run check` проверяет альфа-каналы и контрольные суммы, отрисовывает все 755 кадров, контролирует минимальный размер шрифта, границы текста в ключевых композициях и отсутствие исходных непрозрачных картинок в монтажных слоях. Создаёт `output/design-validation.json` и `output/clean-assets-check.png` с проверочным фоном.
- `npm run stills` создаёт восемь ключевых кадров `output/scene-*.png`.
- `npm run render` полностью пересобирает `output/crypto-volk-motion-final.mp4`: H.264, CRF 17, yuv420p, AAC 256 kbps, faststart. Используется полный исходный аудиофайл.
- `assets/timeline.json` содержит тайминг сцен. Montserrat и Roboto Mono включены локально вместе с лицензиями.
- Chromium по умолчанию запускается из `/usr/bin/chromium`; другой путь задаётся через `CHROMIUM_PATH`.

Зависимости, кэши, промежуточные кадры и ZIP не добавляются в Git. В `output/` отслеживается только финальный MP4. Для сборки не нужны модели распознавания речи. Работайте в существующем checkout; отдельный Git worktree не требуется.

Графики и UI являются иллюстрацией речи, а не реальными котировками или снимками работающего бота. Музыка не добавлялась. Осциллограмма соответствует амплитуде оригинальной записи. Имя/ссылка Telegram-бота не заданы в исходных материалах, поэтому выдуманный адрес в CTA не добавлен.
