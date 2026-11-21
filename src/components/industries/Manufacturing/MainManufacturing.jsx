import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import IndustryStats from "./IndustryStats";
import ChallengesSection from "./ChallengesSection";
import SolutionsSection from "./SolutionsSection";
import CaseStudies from "./CaseStudies";
import ImplementationProcess from "./ImplementationProcess";
import CTASection from "./CTASection";
import Modal from "../../Modal";
import ContactForm from "../../ContactForm";
import { usePageData } from "../../../hooks/useJsonServerData.jsx";

const Manufacturing = ({ data: propsData = null }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(0);
  const [activeSolution, setActiveSolution] = useState(0);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // PRIORITIZE props data over fetched data for real-time preview
  const { data: fetchedData, isLoading: loading } = usePageData("manufacturing");
  const data = propsData || fetchedData;

  // Auto-rotate challenges and solutions
  useEffect(() => {
    if (!data) return;

    const challenges = data.manufacturingChallenges || [];
    const solutions = data.netSuiteSolutions || [];

    if (challenges.length === 0 && solutions.length === 0) return;

    const challengeInterval = challenges.length > 0 ? setInterval(() => {
      setActiveChallenge(
        (prev) => (prev + 1) % challenges.length
      );
    }, 4000) : null;

    const solutionInterval = solutions.length > 0 ? setInterval(() => {
      setActiveSolution((prev) => (prev + 1) % solutions.length);
    }, 5000) : null;

    return () => {
      if (challengeInterval) clearInterval(challengeInterval);
      if (solutionInterval) clearInterval(solutionInterval);
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading manufacturing data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load manufacturing data.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <section data-theme="dark">
        <HeroSection data={data.hero} />
      </section>

      <section data-theme="light">
        <IndustryStats data={data.industryStats} />
      </section>

      <section data-theme="dark">
        <ChallengesSection
          data={data.manufacturingChallenges}
          activeChallenge={activeChallenge}
          setActiveChallenge={setActiveChallenge}
        />
      </section>

      <section data-theme="light">
        <SolutionsSection
          data={data.netSuiteSolutions}
          activeSolution={activeSolution}
          setActiveSolution={setActiveSolution}
        />
      </section>

      <section data-theme="dark">
        <CaseStudies data={data.caseStudies} />
      </section>

      <section data-theme="light">
        <ImplementationProcess data={data.implementationProcess} />
      </section>

      <section data-theme="light">
        <CTASection data={data.cta} openContactModal={openContactModal} />
      </section>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        title={data?.modal?.title || "Contact Us"}
        subtitle={data?.modal?.subtitle || "Get in touch with us"}
      >
        <div className="p-2">
          <ContactForm onSuccess={closeContactModal} />
        </div>
      </Modal>
    </main>
  );
};

export default Manufacturing;
