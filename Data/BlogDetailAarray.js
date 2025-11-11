import {
  FaBook,
  FaDownload,
  FaComment,
  FaCode,
} from "react-icons/fa";

// Static data
 export const comments = [
    {
      id: 1,
      name: "Sarah Johnson",
      date: "2 days ago",
      content: "This tutorial helped me understand React hooks much better!",
      avatar: "SJ",
      isStudent: true,
      replies: [
        {
          id: 2,
          name: "Alex Thompson",
          date: "1 day ago",
          content:
            "Glad to hear it helped! The examples are designed for real-world applications.",
          avatar: "AT",
          isInstructor: true,
        },
      ],
    },
  ];

  export  const codeExamples = [
    {
      title: "Custom Hook Pattern",
      code: `function useApiData(url) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // API call logic here
  }, [url]);

  return state;
}`,
      description: "A robust custom hook for API requests",
    },
  ];


  export  const learningObjectives = [
    "Master React composition patterns",
    "Implement custom hooks for reusable logic",
    "Optimize performance with advanced techniques",
    "Build maintainable component architectures",
  ];

  export const tabs = [
    { id: "content", icon: FaBook, label: "Lesson Content" },
    { id: "exercises", icon: FaCode, label: "Exercises" },
    { id: "resources", icon: FaDownload, label: "Resources" },
    { id: "qa", icon: FaComment, label: "Q&A" },
  ];