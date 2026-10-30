import { useEffect, useId, useRef, useState, type SubmitEvent } from "react";
import { CalendarDays, CircleAlert, Plus, Trash2, X } from "lucide-react";

import * as S from "./TripDateModalStyle";
import DatePicker from "../../pickers/DatePicker";
import {
  isValidTripDate,
  normalizeTripDates,
} from "../../../utils/tripDateUtils";

type Props = {
  open: boolean;
  dates: string[];
  scheduleCounts?: Record<string, number>;
  onClose: () => void;
  onConfirm: (dates: string[]) => void | boolean | Promise<void | boolean>;
};

export default function TripDateModal(props: Props) {
  const [present, setPresent] = useState(props.open);

  if (props.open && !present) {
    setPresent(true);
  }

  if (!present) return null;

  return (
    <TripDateModalContent
      {...props}
      onExited={() => {
        setPresent(false);
      }}
    />
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getUTCDay()];

  return `${value.replaceAll("-", ".")} (${weekday})`;
}

type ContentProps = Props & {
  onExited: () => void;
};

function TripDateModalContent({
  open,
  dates,
  scheduleCounts = {},
  onClose,
  onConfirm,
  onExited,
}: ContentProps) {
  const [draftDates, setDraftDates] = useState(() => normalizeTripDates(dates));
  const [addingDate, setAddingDate] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const busyRef = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pickerAreaRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }

      document.body.style.overflow = previousOverflow;

      if (trigger?.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);

  // CSS 애니메이션이 실제로 끝난 뒤 콘텐츠를 제거합니다.
  // 모션 감소 설정으로 애니메이션이 없으면 바로 완료합니다.
  useEffect(() => {
    if (open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    let cancelled = false;

    const frame = window.requestAnimationFrame(() => {
      const animations = dialog.getAnimations();

      void Promise.allSettled(
        animations.map((animation) => animation.finished),
      ).then(() => {
        if (cancelled) return;

        if (dialog.open) {
          dialog.close();
        }

        onExited();
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [open, onExited]);

  const requestClose = () => {
    if (busyRef.current || !open) return;

    onClose();
  };

  const focusDatePicker = () => {
    pickerAreaRef.current
      ?.querySelector<HTMLButtonElement>(".picker-trigger")
      ?.focus({ preventScroll: true });
  };

  const addDate = () => {
    if (busyRef.current || !open) return;

    if (!isValidTripDate(addingDate)) {
      setError("추가할 날짜를 선택해주세요.");
      focusDatePicker();
      return;
    }

    if (draftDates.includes(addingDate)) {
      setError("이미 포함된 날짜입니다.");
      focusDatePicker();
      return;
    }

    setDraftDates((previous) => normalizeTripDates([...previous, addingDate]));
    setAddingDate("");
    setError("");
    focusDatePicker();
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (busyRef.current || !open) return;

    if (addingDate) {
      setError("선택한 날짜를 추가하거나 초기화해주세요.");
      focusDatePicker();
      return;
    }

    const nextDates = normalizeTripDates(draftDates);

    if (!nextDates.length) {
      setError("여행 날짜는 최소 1개 이상이어야 합니다.");
      return;
    }

    busyRef.current = true;
    setBusy(true);
    setError("");

    try {
      const result = await onConfirm(nextDates);

      if (result !== false) {
        onClose();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "날짜를 적용하지 못했습니다.",
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const disabled = busy || !open;

  return (
    <S.Dialog
      ref={dialogRef}
      data-open={open}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const bounds = event.currentTarget.getBoundingClientRect();

        const outside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom;

        if (outside) {
          requestClose();
        }
      }}
    >
      <S.Form onSubmit={submit} noValidate aria-busy={busy}>
        <S.Header>
          <div>
            <S.Title id={titleId}>
              <CalendarDays aria-hidden="true" />
              여행 날짜 수정
            </S.Title>

            <S.Description id={descriptionId}>
              날짜를 추가하거나 삭제해 여행 일정을 조정하세요.
            </S.Description>
          </div>

          <S.CloseButton
            type="button"
            disabled={disabled}
            onClick={requestClose}
            aria-label="날짜 수정 닫기"
            autoFocus
          >
            <X size={21} aria-hidden="true" />
          </S.CloseButton>
        </S.Header>

        <S.Body>
          <S.SectionHeading>
            <strong>여행 날짜</strong>
            <span>{draftDates.length}일</span>
          </S.SectionHeading>

          <S.DateList aria-label="여행 날짜 목록">
            {draftDates.map((date, index) => (
              <S.DateRow key={date}>
                <S.DayBadge>Day {index + 1}</S.DayBadge>

                <S.DateInfo>
                  <time dateTime={date}>{formatDate(date)}</time>

                  {(scheduleCounts[date] ?? 0) > 0 && (
                    <small>등록된 일정 {scheduleCounts[date]}개</small>
                  )}
                </S.DateInfo>

                <S.DeleteButton
                  type="button"
                  disabled={disabled || draftDates.length <= 1}
                  aria-label={`${formatDate(date)} 삭제`}
                  title={
                    draftDates.length <= 1
                      ? "여행 날짜는 최소 1개 이상이어야 합니다."
                      : "날짜 삭제"
                  }
                  onClick={() => {
                    setDraftDates((previous) =>
                      previous.filter((item) => item !== date),
                    );
                    setError("");
                  }}
                >
                  <Trash2 size={17} aria-hidden="true" />
                  <span>삭제</span>
                </S.DeleteButton>
              </S.DateRow>
            ))}

            {draftDates.length === 0 && (
              <S.EmptyText>여행 날짜를 추가해주세요.</S.EmptyText>
            )}
          </S.DateList>

          {/* <S.AddArea>
            <S.AddControls>
              <S.DatePickerArea ref={pickerAreaRef}>
                <DatePicker
                  label="날짜 추가"
                  value={addingDate}
                  min="1900-01-01"
                  max="9999-12-31"
                  disabled={disabled}
                  modal
                  onChange={(value) => {
                    setAddingDate(value);
                    setError("");
                  }}
                />
              </S.DatePickerArea>

              <S.AddButton
                type="button"
                disabled={disabled || !addingDate}
                onClick={addDate}
              >
                <Plus size={17} aria-hidden="true" />
                추가
              </S.AddButton>
            </S.AddControls>
          </S.AddArea> */}
          <S.AddArea>
            <S.AddControls>
              <S.DatePickerArea ref={pickerAreaRef}>
                <DatePicker
                  label="날짜 추가"
                  value={addingDate}
                  min="1900-01-01"
                  max="9999-12-31"
                  disabled={disabled}
                  placement="top"
                  onChange={(value) => {
                    setAddingDate(value);
                    setError("");
                  }}
                />
              </S.DatePickerArea>

              <S.AddButton
                type="button"
                disabled={disabled || !addingDate}
                onClick={addDate}
              >
                <Plus size={17} aria-hidden="true" />
                추가
              </S.AddButton>
            </S.AddControls>
          </S.AddArea>
          <S.Note>
            <CircleAlert size={16} aria-hidden="true" />
            <span>이른 날짜부터 정렬되며 Day 번호도 자동으로 바뀝니다.</span>
          </S.Note>

          {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
        </S.Body>

        <S.Footer>
          <S.CancelButton
            type="button"
            disabled={disabled}
            onClick={requestClose}
          >
            취소
          </S.CancelButton>

          <S.ConfirmButton
            type="submit"
            disabled={disabled || draftDates.length === 0}
          >
            {busy ? "저장 중..." : "저장하기"}
          </S.ConfirmButton>
        </S.Footer>
      </S.Form>
    </S.Dialog>
  );
}
