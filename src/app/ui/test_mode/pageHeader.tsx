import React from 'react';

export const PageHeader = ({
  title,
  currentTaskIndex,
  totalTasks,
  timeLeft,
  shouldUseTimer,
  formatTime
}) => {
  return (
    <div className="container-fluid px-0 mb-3">
      {/* Заголовок завжди зверху на мобільних пристроях */}
      <div className="row mb-2 text-center">
        <div className="col-12">
          <h4 className="mb-0 fw-bold">Тема: {title || "Невідома"}</h4>
        </div>
      </div>

      {/* Таймер та номер завдання в один ряд */}
      <div className="row align-items-center">
        {shouldUseTimer && (
          <div className="col-6 text-start">
            <h5 className="mb-0 fw-bold">
              <span className="">Час: {formatTime(timeLeft)}</span>
            </h5>
          </div>
        )}
        <div className={`col-${shouldUseTimer ? "6" : "12"} text-${shouldUseTimer ? "end" : "center"}`}>
          <h5 className="mb-0 fw-bold">{`Завдання ${currentTaskIndex + 1} з ${totalTasks}`}</h5>
        </div>
      </div>
    </div>

    // <div className="container-fluid px-0 mb-3">
    //   {/* Заголовок завжди зверху на мобільних пристроях */}
    //   <div className="row mb-2 text-center">
    //     <div className="col-12">
    //       <h4 className="mb-0">Тема: {title || "Невідома"}</h4>
    //     </div>
    //   </div>
      
    //   {/* Таймер та номер завдання в один ряд */}
    //   <div className="row align-items-center">
    //     {shouldUseTimer && (
    //       <div className="col-6 text-start">
    //         <h5 className="mb-0">
    //           <span className="badge bg-primary">
    //             Час: {formatTime(timeLeft)}
    //           </span>
    //         </h5>
    //       </div>
    //     )}
    //     <div className={`col-${shouldUseTimer ? '6' : '12'} text-${shouldUseTimer ? 'end' : 'center'}`}>
    //       <h5 className="mb-0">{`Завдання ${currentTaskIndex + 1} з ${totalTasks}`}</h5>
    //     </div>
    //   </div>
    // </div>
  );
};
// import React from 'react';

// export const PageHeader = ({ 
//   title, 
//   currentTaskIndex, 
//   totalTasks, 
//   timeLeft, 
//   shouldUseTimer, 
//   formatTime 
// }) => {
//   return (
//     <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
//       {shouldUseTimer && (
//         <div className="position-absolute start-0 d-flex align-items-center">
//           <div className="timer-container">
//             <h5 className="mb-0">
//               <span className="badge bg-primary">
//                 Час: {formatTime(timeLeft)}
//               </span>
//             </h5>
//           </div>
//         </div>
//       )}
//       <h4 className="position-absolute start-50 translate-middle-x">
//         Тема: {title || "Невідома"}
//       </h4>
//       <h5 className="ms-auto">{`Завдання ${currentTaskIndex + 1} з ${totalTasks}`}</h5>
//     </div>
//   );
// };