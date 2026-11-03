'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import {
  domains,
  getLabKeywordHit,
  modelPromptRepairAnswer,
} from '../../../learner-app';
import { isLabKind } from '../../../learner-routes-model';
import { useApp } from '../../../learner-app-context';

export default function LabScreen() {
  const t = useTranslations('lab');
  const {
    activeLab,
    openLab,
    openedLabKind,
    labCanSubmit,
    labDraft,
    labEvaluation,
    labFeedbackVisible,
    labMatches,
    labOrder,
    labSelections,
    moveLabOrder,
    setLabDraft,
    setLabFeedbackVisible,
    setLabMatches,
    setStep,
    startAssessment,
    toggleLabSelection,
  } = useApp();
  const { kind } = useParams<{ kind: string }>();
  const knownKind = isLabKind(kind) ? kind : null;

  // A lab opened from its URL (not from a lab card) starts from a clean slate.
  useEffect(() => {
    if (knownKind && openedLabKind !== knownKind) openLab(knownKind);
  }, [knownKind, openedLabKind, openLab]);

  if (!knownKind) notFound();

  return (
    <section className="lab-shell">
      <div className="lab-top">
        <button className="secondary" onClick={() => setStep('learningLabs')} type="button">{t('backToLabs')}</button>
        <div>
          <p className="eyebrow">{t('learnByDoing')}</p>
          <h1>{activeLab.title}</h1>
          <p>{activeLab.brief}</p>
        </div>
        <div className="lab-meta">
          <span>{activeLab.domain}</span>
          <strong>{domains[activeLab.domain].name}</strong>
          <small>{activeLab.format}</small>
        </div>
      </div>

      <div className="lab-workbench">
        <article className="lab-artifact">
          <span>{t('practiceArtifact')}</span>
          <h2>{activeLab.artifact.title}</h2>
          <div className="lab-artifact-rows">
            {activeLab.artifact.rows.map((row) => (
              <p key={row}>{row}</p>
            ))}
          </div>
          {activeLab.artifact.note && <strong>{activeLab.artifact.note}</strong>}
        </article>

        <article className="lab-task">
          {activeLab.kind === 'prompt' && (
            <>
              <span>{t('buildThePrompt')}</span>
              <h2>{activeLab.prompt}</h2>
              <textarea
                value={labDraft}
                onChange={(event) => {
                  setLabDraft(event.target.value);
                  setLabFeedbackVisible(false);
                }}
                placeholder={t('exampleActAsACustomer')}
              />
              <button
                className="secondary"
                onClick={() => {
                  setLabDraft(modelPromptRepairAnswer);
                  setLabFeedbackVisible(false);
                }}
                type="button"
              >
                {t('showExamplePrompt')}
              </button>
              <div className="lab-checklist">
                {(activeLab.checklist ?? []).map((item) => (
                  <span className={getLabKeywordHit(item, labDraft) ? 'hit' : ''} key={item}>{item}</span>
                ))}
              </div>
            </>
          )}

          {(activeLab.kind === 'proof' || activeLab.kind === 'media') && (
            <>
              <span>{t('selectChecks')}</span>
              <h2>{t('whichActionsBelongInYour')}</h2>
              <div className="lab-choice-list">
                {(activeLab.choices ?? []).map((choice) => (
                  <button
                    className={labSelections.includes(choice.id) ? 'selected' : ''}
                    key={choice.id}
                    onClick={() => toggleLabSelection(choice.id)}
                    type="button"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {activeLab.kind === 'next' && (
            <>
              <span>{t('chooseNextAction')}</span>
              <h2>{t('whatWouldYouDoFirst')}</h2>
              <div className="lab-choice-list">
                {(activeLab.choices ?? []).map((choice) => (
                  <button
                    className={labSelections.includes(choice.id) ? 'selected' : ''}
                    key={choice.id}
                    onClick={() => toggleLabSelection(choice.id, true)}
                    type="button"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {activeLab.kind === 'workflow' && (
            <>
              <span>{t('orderTheWorkflow')}</span>
              <h2>{t('moveTheStepsIntoThe')}</h2>
              <div className="lab-order-list">
                {labOrder.map((itemId, index) => {
                  const item = activeLab.items?.find((labItem) => labItem.id === itemId);
                  return (
                    <div key={itemId}>
                      <strong>{index + 1}</strong>
                      <p>{item?.label}</p>
                      <button onClick={() => moveLabOrder(index, -1)} disabled={index === 0} type="button">{t('up')}</button>
                      <button onClick={() => moveLabOrder(index, 1)} disabled={index === labOrder.length - 1} type="button">{t('down')}</button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {(activeLab.kind === 'trust' || activeLab.kind === 'ownership') && (
            <>
              <span>{t('matchControls')}</span>
              <h2>{activeLab.kind === 'trust' ? t('whichControlFitsEachRisk') : t('whoShouldOwnEachStep')}</h2>
              <div className="lab-match-list">
                {(activeLab.items ?? []).map((item) => (
                  <label key={item.id}>
                    <span>{item.label}</span>
                    <select
                      value={labMatches[item.id] ?? ''}
                      onChange={(event) => {
                        setLabMatches((matches) => ({ ...matches, [item.id]: event.target.value }));
                        setLabFeedbackVisible(false);
                      }}
                    >
                      <option value="">{t('choose')}</option>
                      {(activeLab.matchChoices ?? []).map((choice) => (
                        <option key={choice} value={choice}>{choice}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="lab-actions">
            <button className="primary" disabled={!labCanSubmit} onClick={() => setLabFeedbackVisible(true)} type="button">{t('checkMyWork')}</button>
            <button className="secondary" onClick={() => startAssessment('free')} type="button">{t('startFullAssessment')}</button>
          </div>
        </article>

        <aside className="lab-feedback">
          <span>{t('labFeedback')}</span>
          {labFeedbackVisible ? (
            <>
              {activeLab.kind === 'prompt' ? <><strong>{t('checklistCuesFound', { length: labEvaluation.strengths.length, length2: (activeLab.checklist ?? []).length })}</strong><p>{t('englishKeywordHintsOnlyThis')}</p></> : <strong>{labEvaluation.score}/100</strong>}
              <p>{labEvaluation.summary}</p>
              <div>
                <h3>{t('whatWorked')}</h3>
                {(labEvaluation.strengths.length ? labEvaluation.strengths : ['No strong evidence yet. Try adding one concrete check or control.']).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div>
                <h3>{t('improveNext')}</h3>
                {(labEvaluation.misses.length ? labEvaluation.misses : ['You covered the key requirements for this lab.']).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </>
          ) : (
            <p>{t('completeTheLabAndCheck')}</p>
          )}
        </aside>
      </div>
    </section>
  );
}
