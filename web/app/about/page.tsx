import Link from "next/link";

export const metadata = {
  title: "회사 소개 — pilaos",
  description: "필라오스는 필라테스·요가 학원 인수만 다루는 도메인 특화 자문 플랫폼입니다.",
};

export default function About() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-2xl px-5 pt-14 pb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">회사 소개</div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          필라테스·요가 인수의<br />
          <span className="text-blue-600">시작과 끝</span>을 함께합니다.
        </h1>
        <p className="mt-5 text-base text-black/65 leading-relaxed">
          필라오스는 필라테스·요가 학원 영업양수도(권리금 거래)만 다루는 <strong className="text-black">도메인 특화 자문 플랫폼</strong>입니다.
          매물 자동 발굴부터 가격 산정·실사·계약·1년 사후 점검까지 사람 한 명의 운영팀이 카톡 한 채널로 끝까지 함께 갑니다.
        </p>
      </section>

      {/* 우리는 어떤 사람들 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <h2 className="text-xl font-extrabold">우리는 어떤 사람들인가요</h2>
          <div className="mt-6 space-y-4">
            <Block num="01" title="필라테스·요가 인수만 다룹니다">
              일반 점포 중개사와 다릅니다. 회원권 잠재 부채, 강사 단체 이탈, 임대인 갱신 거부 같은 도메인 특유의 위험을 사전에 막는 데 집중합니다.
            </Block>
            <Block num="02" title="법률은 변호사에게, 세무는 세무사에게">
              우리는 자문료에 일절 관여하지 않습니다. 변호사·세무사가 의뢰인에게 직접 청구하고, 우리는 매칭과 일정 조율만 무료로 제공합니다 (변호사법 제109조 준수).
            </Block>
            <Block num="03" title="자금은 우리가 보관하지 않습니다">
              권리금은 법무법인 예치 계좌 또는 은행 신탁 계좌로 안내합니다. 우리는 자금 보관 행위를 하지 않습니다 (특정금융정보법 준수).
            </Block>
            <Block num="04" title="단계마다 그만 두실 수 있습니다">
              착수금 → 예약금 → 성공 보수까지 5단계로 분리. 매수자·매도자 모두 다음 단계로 가지 않으면 추가 비용이 없습니다.
            </Block>
          </div>
        </div>
      </section>

      {/* 어떤 데이터로 일하나 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <h2 className="text-xl font-extrabold">우리가 보는 데이터</h2>
          <p className="mt-2 text-sm text-black/65">필라테스·요가 학원 평가에는 다른 점포와는 다른 데이터가 필요합니다.</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Tag label="POS 매출 데이터" />
            <Tag label="카드사 입금 명세" />
            <Tag label="회원관리 SW 데이터" />
            <Tag label="회원권 잔여 / 환불 약관" />
            <Tag label="강사 4대보험 / 급여대장" />
            <Tag label="임대차 계약 + 갱신 이력" />
            <Tag label="리포머·캐딜락 시리얼·연식" />
            <Tag label="네이버·카카오·구글 디지털 운영" />
            <Tag label="블로그·인스타 후기 동향" />
            <Tag label="시군구 시세 분포" />
          </div>
        </div>
      </section>

      {/* 어떻게 시작했나 — 한 줄 스토리 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <h2 className="text-xl font-extrabold">시작</h2>
          <blockquote className="mt-5 rounded-2xl border-l-4 border-blue-600 bg-white px-6 py-5 text-[15px] text-black/85 leading-relaxed">
            "필라테스·요가 인수는 분쟁 빈도가 30%인데, 매수자는 도메인 데이터 없이 매도자 카톡 캡처만 보고 결정합니다.
            매물 검증·매도자 컨택·변호사 매칭·금융 매칭이 다 흩어져 있어 한 사람이 다 챙기기는 불가능합니다.<br /><br />
            그래서 도메인 특화 운영팀이 사람 1명으로 끝까지 함께 가는 모델을 만들었습니다."
          </blockquote>
          <p className="mt-3 text-xs text-black/45 text-right">— pilaos 운영팀</p>
        </div>
      </section>

      {/* 운영팀 컨택 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <h2 className="text-xl font-extrabold">운영팀 컨택</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Contact label="카톡 채널" value="@pilaos" hint="가장 빠릅니다" />
            <Contact label="이메일" value="hello@pilaos.kr" hint="공식 문의" />
            <Contact label="운영 시간" value="평일 9~18시" hint="주말 카톡 접수" />
            <Contact label="회신 시간" value="24시간 이내" hint="카톡 우선" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/10 bg-blue-50">
        <div className="mx-auto max-w-2xl px-5 py-14 text-center">
          <h2 className="text-2xl font-extrabold">시작은 무료 상담부터.</h2>
          <p className="mt-2 text-sm text-black/65">휴대폰만 남기시면 24시간 안에 카톡으로 인사드립니다.</p>
          <Link href="/inquire?kind=acquire" className="mt-6 inline-block rounded-lg bg-black px-8 py-3 text-base font-bold text-white hover:bg-black/85">상담 신청 →</Link>
        </div>
      </section>
    </div>
  );
}

function Block({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-black/10 p-5">
      <div className="text-[11px] font-extrabold text-blue-600">{num}</div>
      <h3 className="mt-1 text-[16px] font-extrabold text-black">{title}</h3>
      <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{children}</p>
    </div>
  );
}
function Tag({ label }: { label: string }) {
  return <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-[13px] font-medium text-black">• {label}</div>;
}
function Contact({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-black/[.02] p-4">
      <div className="text-[11px] font-bold text-black/55 uppercase">{label}</div>
      <div className="mt-1 text-[16px] font-extrabold text-black">{value}</div>
      <div className="mt-0.5 text-[11px] text-black/55">{hint}</div>
    </div>
  );
}
