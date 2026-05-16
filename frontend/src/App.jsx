import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [darkMode, setDarkMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [isSignup, setIsSignup] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = "https://todo-app-w2.onrender.com/api/todos";


  // LOGIN
  const login = async () => {

    try {

      const response = await axios.post(
        "https://todo-app-w2.onrender.com/api/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setLoggedIn(true);

    } catch (error) {

      console.log(error);

      alert("Invalid credentials");
    }
  };


  // SIGNUP
  const signup = async () => {

    try {

      const response = await axios.post(
        "https://todo-app-w2.onrender.com/api/auth/register",
        {
          email,
          password
        }
      );

      alert(response.data.message);

      setIsSignup(false);

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Signup failed"
      );
    }
  };
  const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};


  // FETCH TODOS
  const fetchTodos = async () => {

    try {

      const response = await axios.get(API, config);

      setTodos(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    const initializeApp = async () => {

      await fetchTodos();

      const token = localStorage.getItem("token");

      if (token) {
        setLoggedIn(true);
      }
    };

    initializeApp();

  });


  // ADD TODO
  const addTodo = async () => {

    if (!text || !date || !time) {
      return alert("Fill all fields");
    }

    try {

      const response = await axios.post(API, {
        text,
        date,
        time
      }, config);

      setTodos([...todos, response.data]);

      setText("");
      setDate("");
      setTime("");

    } catch (error) {

      console.log(error);
    }
  };


  // DELETE TODO
  const deleteTodo = async (id) => {

    try {

      await axios.delete(`${API}/${id}`);

      setTodos(
        todos.filter(todo => todo._id !== id)
      );

    } catch (error) {

      console.log(error);
    }
  };


  // EDIT TODO
  const editTodo = async (id) => {

    if (!text || !date || !time) {
      return alert("Fill all fields");
    }

    try {

      const response = await axios.put(
        `${API}/${id}`,
        {
          text,
          date,
          time
        }
        , config
      );

      setTodos(
        todos.map(todo =>
          todo._id === id
            ? response.data
            : todo
        )
      );

      setEditingId(null);

      setText("");
      setDate("");
      setTime("");

    } catch (error) {

      console.log(error);
    }
  };


  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    setLoggedIn(false);
  };


  // LOGIN / SIGNUP PAGE
  if (!loggedIn) {

    return (

      <div className="login-page">

        <div className="login-box">

          <h1>
            {
              isSignup
                ? "Create Account"
                : "Welcome Back"
            }
          </h1>

          <p>
            {
              isSignup
                ? "Signup to continue"
                : "Login to your account"
            }
          </p>


          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />


          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />


          {
            isSignup ? (

              <button onClick={signup}>
                Signup
              </button>

            ) : (

              <button onClick={login}>
                Login
              </button>
            )
          }


          <p className="toggle-text">

            {
              isSignup
                ? "Already have an account?"
                : "Don't have an account?"
            }

            <span
              onClick={() =>
                setIsSignup(!isSignup)
              }
            >
              {
                isSignup
                  ? " Login"
                  : " Signup"
              }
            </span>

          </p>

        </div>

      </div>
    );
  }


  // LOADING
  if (loading) {
    return <h1>Loading...</h1>;
  }


  return (

    <div className={darkMode ? "app dark" : "app"}>

      <div className="topbar">

        <h1>Todo App</h1>

        <div>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {
              darkMode
                ? "Light Mode"
                : "Dark Mode"
            }
          </button>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </div>


      <div className="todo-form">

        <input
          type="text"
          placeholder="Enter activity"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
        />


        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />


        <input
          type="time"
          value={time}
          onChange={(e) =>
            setTime(e.target.value)
          }
        />


        {
          editingId ? (

            <button
              onClick={() =>
                editTodo(editingId)
              }
            >
              Update
            </button>

          ) : (

            <button onClick={addTodo}>
              Add
            </button>
          )
        }

      </div>


      <div className="todo-container">

        {
          todos.map(todo => (

            <div
              className="todo-card"
              key={todo._id}
            >

              <div className="todo-left">

                <h3>{todo.text}</h3>

                <p>
                  📅 {todo.date}
                </p>

                <p>
                  ⏰ {todo.time}
                </p>

              </div>


              <div className="todo-right">

                <button
                  className="edit-btn"
                  onClick={() => {

                    setEditingId(todo._id);

                    setText(todo.text);

                    setDate(todo.date);

                    setTime(todo.time);
                  }}
                >
                  Edit
                </button>


                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteTodo(todo._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default App;