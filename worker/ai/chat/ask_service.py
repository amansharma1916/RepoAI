    

from ai.llm.llm_service import LLMService
from services.analysis.symbol_repository import SymbolRepository
from services.retrieval.retrieval_service import RetrievalService


class AskService:

    def __init__(self):

        

        self.symbol_repository = (
            SymbolRepository()
        )

    LOOKUP_KEYWORDS = [
            "where",
            "find",
            "locate",
            "defined",
            "definition",
            "path"
        ]

    STOP_WORDS = {
        "where",
        "is",
        "the",
        "a",
        "an",
        "find",
        "locate",
        "defined",
        "definition",
        "path"
    }



    def ask(
        self,
        repository_id: int,
        question: str
    ):
        

        symbol = self._try_symbol_lookup(
            repository_id,
            question
        )

        if symbol and self._is_lookup_question(question):

            response = "I found several relevant symbols in the codebase:\n\n"

            for name, kind, path, lang in symbol:
                response += (
                    f"{name} is a {kind} defined in `{path}` "
                    f"(language: {lang}).\n\n"
                )

            return response

        self.retrieval_service = (
            RetrievalService()
        )

        self.llm_service = (
            LLMService()
        )

        results = (
            self.retrieval_service
            .semantic_search(
                repository_id,
                question,
                limit=5
            )
        )

        context = "\n\n".join(
                    [
                        f"""
                File: {chunk['file_path']}
                Name: {chunk['chunk_name']}
                Type: {chunk['chunk_type']}

                {chunk['content'][:1000]}
                """
                        for chunk in results
                    ]
        )

        prompt = f"""
        You are RepoAI, an AI assistant that helps developers understand repositories.

        Use only the provided repository context to answer the question.

        If the answer is not present in the context, say:
        "I could not find enough information in the repository context."

        Keep the answer under 10 sentences.
        Be concise and focus only on the code flow.

        Repository Context: 

        {context}

        Question:
        {question}

        Answer:
        """

        answer = (
            self.llm_service
            .generate(prompt)
        )

        return answer
    


    def _try_symbol_lookup(
        self,
        repository_id: int,
        question: str
    ):
        words = [
            word
            for word in (
                question
                .lower()
                .replace("?", "")
                .split()
            )
            if word not in self.STOP_WORDS
        ]

        print("words : ", words)

        results = []

        for word in words:
            if len(word) < 2:
                continue

            result = (
                self.symbol_repository
                .search_symbols(
                    repository_id,
                    word
                )
            )
            
            if result:
                results.extend(result)

        print("results : ", results)
        return results if results else None






    def _is_lookup_question(
        self,
        question: str
    ):

        question = question.lower()

        return any(
            keyword in question
            for keyword in self.LOOKUP_KEYWORDS
        )