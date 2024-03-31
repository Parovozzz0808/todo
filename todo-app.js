(function() {
    let todoArr = [],
        listName = '';
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');  // создаем элемент h2
        appTitle.innerHTML = title;  // в элемент h2 помещаем переменную функции 
        return appTitle; // возвращаем заголовок
    };
    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form'); // создаем элемнт form
        let input = document.createElement('input');  // создаем элем input
        let buttonWrapper = document.createElement('div'); // создаем div, в который вложим кнопку
        let button = document.createElement('button'); // создаем кнопку

        form.classList.add('input-group', 'mb-3'); // создаем классы для формы
        input.classList.add('form-control'); // создаем класс для инпута
        input.placeholder = 'Введите название задачи'; // создаем плейсхолдер для инпута
        buttonWrapper.classList.add('input-group-append'); // класс для дива
        button.classList.add('btn', 'btn-primary'); // класс для кнопки
        button.textContent = 'Добавить задачу'; // текст кнопки
        button.disabled = true;

        input.addEventListener('input', function() {
            if(input.value) {
                button.disabled = false;
            } else {
                button.disabled = true;
            };
        });

        buttonWrapper.append(button); // добавляем кнопку в див
        form.append(input); // инпут в форму
        form.append(buttonWrapper); // див с кнопкой в форму

        return { // возвращаем форму инпут и кнопку для взаимодействия с ними
            form, 
            input,
            button
        };    
    };
    // создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul'); //создаем список
        list.classList.add('list-group'); //класс списка
        return list; //возвращаем список
    };
    // создаем и возвращаем элемент списка
    function createTodoItem(obj) {
        let item = document.createElement('li'); //создаем элемент списка
        let buttonGroup = document.createElement('div'); //создаем див для кнопок
        let doneButton = document.createElement('button'); //создаем кнопку Done
        let deleteButton = document.createElement('button'); //создаем кнопку  Delete
        done = false;
       

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center'); // класс элемента списка
        item.textContent = obj.name; //присваиваем переменную name как имя элемента
                
        buttonGroup.classList.add('btn-group', 'btn-group-sm'); //класс
        doneButton.classList.add('btn', 'btn-success'); //класс
        doneButton.textContent = 'Готово'; // название кнопки
        deleteButton.classList.add('btn', 'btn-danger'); //класс
        deleteButton.textContent = 'Удалить'; // название кнопки

        if (obj.done == true) item.classList.add('list-group-item-success');

        // добавляем обработчики на кнопки
        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success'); //по нажатию кнопки Done добавляется класс
            
            for (const listItem of todoArr) {
              if (listItem.id == obj.id) listItem.done = !listItem.done 
            }
            saveList (todoArr, listName);
        });
        deleteButton.addEventListener('click', function() { //по нажатию кнопки Delete проверка и удаление строки
            if (confirm('Вы уверены?')) {
                item.remove();
                           
                for (let i = 0; i < todoArr.length; i++) {
                    if (todoArr[i].id == obj.id) todoArr.splice(i, 1)  
            }
            saveList (todoArr, listName);
            }
        });

        buttonGroup.append(doneButton); // добавляем кнопку в див
        buttonGroup.append(deleteButton); // добавляем кнопку в див
        item.append(buttonGroup); // добавляем див с кнопками в элемент списка

        return { // возвращаем строку и кнопки
            item,
            doneButton,
            deleteButton,
        };
    };


    function getNewId (arr) {
        let max = 0;
        for(const item of arr) {
            if (item.id > max) max = item.id
        }
        return max + 1;
    }

    function saveList (arr, keyName) {
        let itemStorage = JSON.stringify(arr);
        localStorage.setItem(keyName, itemStorage);
    }

    function createTodoApp(container, title = 'Список дел', keyName) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;

        // помещаем все элементы в контенер приложения
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName);
        
        if (localData !== null && localData !== '') todoArr = JSON.parse(localData)
  
        for (const itemList of todoArr) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item); 
        }
        
        todoItemForm.form.addEventListener('submit', function(e) { //событие создается по нажатию Enter или кнопку создания дел
            e.preventDefault(); //предотвращает перезагрузку браузера при отправке формы

            if (!todoItemForm.input.value) { //если поле ввода пусто, элемент не создается
               return;
            };

        let newItem = {
            id: getNewId(todoArr), 
            name: todoItemForm.input.value,
            done: false,
        }

        let todoItem = createTodoItem(newItem); // введенное значение создает и равно  элементу списка 

        todoArr.push(newItem);

        
        // создаем и добавляем в список новое дело с названием из поля ввода
        todoList.append(todoItem.item);

        saveList (todoArr, listName);

        // обнуляем значение в поле ввода
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
        });
    };

    window.createTodoApp = createTodoApp;

})();



