# AI Development Workflow Comparison

## 1. Overview

This experiment compared two approaches to building an Employee Settings Form for my Employee Onboarding Assistant project. The purpose was to understand how the quality of AI instructions affects the development process. Round One used a single vague prompt, while Round Two used a detailed prompt with clear requirements, constraints, and testing instructions.

## 2. Correctness

In Round One, I gave AI a short instruction: "Create an employee settings form for my onboarding assistant." The prompt did not explain the exact fields, validation rules, or expected behaviour.

In Round Two, I specified three fields: Full Name, Work Email, and Department. I also requested required-field validation, email format validation, and a success message after valid submission. This gave AI a clearer understanding of what I expected.

## 3. Accessibility

For Round Two, I requested proper labels, clear error messages, keyboard navigation, and a responsive black-and-white design. I also asked AI to consider a mobile screen width of 390px. These requirements helped make accessibility and mobile usability part of the development instructions.

## 4. Edge Cases and Testing

Round Two included a separate test file called `settings.test.js`. It covered three situations: empty required fields, invalid email addresses, and successful form submission. According to the reported results, all three tests passed using `node --test settings.test.js`.

Testing was important because it provided evidence about the form's behaviour instead of relying only on how the code looked.

## 5. Review Effort

Round One required more manual checking because the prompt did not clearly define the expected behaviour. Round Two took more effort during planning, but its detailed requirements and test results made the review process more structured.

## 6. AI Mistake and Limitations

During Round Two, AI found that the existing Round One form files were not present in the current branch, so it created the files again. This showed why checking the current branch and project files is important before making changes.

The form does not save employee information to a real database. Its success message is only a frontend demonstration. Email validation checks the format, not whether an email address exists.

## 7. Conclusion

This experiment taught me that using AI is not just about writing prompts. It also requires clear requirements, project context, testing, and human review. In future work, I will inspect existing files, explain expected behaviour, request tests, and verify AI-generated changes before accepting them.