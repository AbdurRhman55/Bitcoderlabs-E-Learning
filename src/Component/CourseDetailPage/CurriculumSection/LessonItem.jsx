import { FaClock, FaCheck } from "react-icons/fa";
// import { Syllabus } from "../../../../Data/Courses.Array";
import Button from "../../UI/Button";

export default function LessonItem({ lesson }) {
  return (
    <div className="group/lesson bg-white rounded-xl border-2 border-gray-100 hover:border-primary lg:px-4 px-2 lg:py-3 py-1 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between gap-2 p-2">
        <div className="flex items-center gap-4 ">
          
          <div className="flex flex-col gap-2">
            <h4 className="lg:text-lg text-sm font-semibold text-gray-900 group-hover/lesson:text-primary-dark transition-colors">
              {lesson.name}
            </h4>
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <FaClock className="text-primary" />
                {lesson.duration}
              </span>
              <span className="lg:px-3 px-1 lg:py-1 py-0 rounded-full text-xs font-medium capitalize text-primary bg-primary-light border">
                {lesson.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {lesson.completed && (
            <span className=" lg:px-4 px-2  lg:py-2 py-1 bg-white text-primary rounded-full lg:text-sm text-xs font-medium flex items-center gap-2 border-1 border-primary-dark">
              <FaCheck className="text-primary" />
              Completed
            </span>
          )}
          <div className="lg:hidden">
            <Button text="Start Lesson"  size="xs"/>
          </div>
          <div className="hidden lg:block">
            <Button text="Start Lesson" />
          </div>
        </div>
      </div>
    </div>
  );
}
