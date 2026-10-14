import { useState } from "react";
import { ChevronDown, CircleHelp, Headset, Megaphone } from "lucide-react";
import * as S from "./supportStyle";

const supportCards = [
  {
    id: "notice",
    title: "공지사항",
    description: "중요한 소식을 확인해 보세요.",
    icon: Megaphone,
  },
  {
    id: "contact",
    title: "고객센터",
    description: "궁금한 점을 문의해 보세요.",
    icon: Headset,
  },
  {
    id: "help",
    title: "도움말",
    description: "서비스 이용 방법을 알아보세요.",
    icon: CircleHelp,
  },
] as const;

const questions = [
  {
    question: "여행에 동행자를 어떻게 초대하나요?",
    answer:
      "여행 상세 화면에서 ‘공유’를 선택한 뒤 초대 링크를 동행자에게 보내 주세요.",
  },
  {
    question: "여행 일정을 수정할 수 있나요?",
    answer:
      "내가 만든 여행은 직접 수정할 수 있어요. 초대받은 여행에서는 호스트에게 편집 권한을 받은 경우 일정을 수정할 수 있어요.",
  },
  {
    question: "저장한 장소는 어디에서 확인하나요?",
    answer:
      "내 여행에서 해당 여행을 선택하면 날짜별 일정과 저장된 장소를 확인할 수 있어요.",
  },
  {
    question: "비밀번호를 잊어버렸어요.",
    answer:
      "로그인 상태라면 마이페이지의 ‘계정 및 보안’에서 비밀번호 변경 화면을 열 수 있어요. 로그인할 수 없는 경우의 비밀번호 재설정 기능은 별도 연동이 필요해요.",
  },
] as const;

export default function Support() {
  const [openQuestions, setOpenQuestions] = useState<number[]>([0]);

  const toggleQuestion = (index: number) => {
    setOpenQuestions((previous) => {
      if (previous.includes(index)) {
        return previous.filter((item) => item !== index);
      }

      return [...previous, index];
    });
  };

  return (
    <S.SupportContent>
      <S.QuickCardGrid aria-label="고객지원 메뉴">
        {supportCards.map(({ id, title, description, icon: Icon }) => (
          <S.QuickCard key={id}>
            <S.QuickCardIcon aria-hidden="true">
              <Icon size={58} strokeWidth={1.8} />
            </S.QuickCardIcon>

            <S.QuickCardTitle>{title}</S.QuickCardTitle>

            <S.QuickCardDescription>{description}</S.QuickCardDescription>
          </S.QuickCard>
        ))}
      </S.QuickCardGrid>

      <S.FaqSection aria-labelledby="faq-heading">
        <S.FaqHeading id="faq-heading">자주하는 질문</S.FaqHeading>

        <S.FaqList>
          {questions.map(({ question, answer }, index) => {
            const expanded = openQuestions.includes(index);

            return (
              <S.FaqItem key={question}>
                <S.FaqQuestionButton
                  type="button"
                  id={`faq-question-${index}`}
                  aria-expanded={expanded}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => toggleQuestion(index)}
                >
                  <span>{question}</span>

                  <S.FaqChevron $expanded={expanded} aria-hidden="true">
                    <ChevronDown size={26} strokeWidth={1.8} />
                  </S.FaqChevron>
                </S.FaqQuestionButton>

                {expanded && (
                  <S.FaqAnswer
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    {answer}
                  </S.FaqAnswer>
                )}
              </S.FaqItem>
            );
          })}
        </S.FaqList>
      </S.FaqSection>
    </S.SupportContent>
  );
}
