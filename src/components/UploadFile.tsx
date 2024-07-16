import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import scss from "./Upload.module.scss";

interface IFormInput {
  title: string;
  email: string;
  file: string[];
}
const UploadFile = () => {
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const [data, setData] = useState<object[]>([]);
  const [_id, setId] = useState<null | number>(null);
  const [edId, setEdId] = useState<number | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    const file = data.file[0];
    const formData = new FormData();

    formData.append("file", file);

    const { data: responseImage } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/upload/file`,
      formData
    );
    const newData = {
      title: data.title,
      email: data.email,
      img: responseImage.url,
      isCompleted: false,
    };
    const { data: responseTodos } = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/251331a97875ec7a37511b4088176f71/form`,
      newData
    );
    setIsLoading(false);
    console.log(responseTodos);
    setData(responseTodos);
    reset();
  };
  console.log(data, "todos");

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/251331a97875ec7a37511b4088176f71/form/`
      );
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };
  async function removeTodos(_id: number | undefined | null) {
    await axios.delete(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/251331a97875ec7a37511b4088176f71/form/${_id}`
    );
    fetchTodos();
  }

  // const updateItem = async (_id: number, newFile: File | null) => {
  //   try {
  //     if (!newFile) return;

  //     const formData = new FormData();
  //     formData.append("file", newFile);

  //     const { data: responseImg } = await axios.post(
  //       "https://api.elchocrud.pro/api/v1/upload/file",
  //       formData
  //     );

  //     const { data: updatedTodo } = await axios.patch(
  //       `${
  //         import.meta.env.VITE_BACKEND_URL
  //       }/251331a97875ec7a37511b4088176f71/form/${_id}`,
  //       { img: responseImg.url, title: data }
  //     );

  //     setData((prevTodos) =>
  //       prevTodos.map((todo) =>
  //         todo._id === _id ? { ...todo, img: updatedTodo.img } : todo
  //       )
  //     );

  //     setEdit(false);
  //   } catch (error) {
  //     console.error("Ошибка при обновлении:", error);
  //   }
  //   fetchTodos();
  // };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className={scss.todos}>
      <h1>Upload File</h1>
      <div className={scss.cards}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("title", { required: true })}
            placeholder="title"
            type="text"
          />
          <input
            placeholder="email"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            type="text"
          />
          <input
            className={scss.fileInp}
            {...register("file", { required: true })}
            type="file"
          />
          {isLoading ? (
            <button disabled type="submit">
              Downloading task..
            </button>
          ) : (
            <button type="submit">Download task</button>
          )}
        </form>
      </div>

      <div>
        {data !== null ? (
          <div
            className={scss.perfumes}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "30px",
              marginTop: "40px",
            }}
          >
            {data.map((el, index) => (
              <div key={index} className={scss.card}>
                {edit && el._id == edId ? (
                  <>
                    <div className={scss.img}>
                      <img src={el.img} alt="" />
                    </div>
                    <div className={scss.p}>
                      <input
                        // {...register("title", { required: true })}
                        placeholder="New title"
                        type="text"
                      />
                    </div>
                    <input
                      {...register("file", { required: true })}
                      type="file"
                    />

                    <div className={scss.btns}>
                      <button
                        onClick={() => {
                          handleSubmit(onSubmit);
                        }}
                        color="secondary"
                        aria-label="edit"
                      >
                        save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={scss.img}>
                      <img src={el.img} alt="" />
                    </div>
                    <div className={scss.p}>
                      <p>{el.title}</p>
                    </div>

                    <div className={scss.btns}>
                      <button
                        onClick={() => {
                          setEdId(el._id);
                          setEdit(true);
                        }}
                        color="secondary"
                        aria-label="edit"
                      >
                        edit
                      </button>
                      <button
                        onClick={() => {
                          setId(el._id);
                          removeTodos(_id);
                        }}
                      >
                        delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1>loading...</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
